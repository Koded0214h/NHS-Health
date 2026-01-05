import requests
import json
import sys

BASE_URL = "http://localhost:8000"

def print_report(message):
    print(f"[REPORT] {message}")

def make_request(method, url, data=None, headers=None):
    try:
        if method == "GET":
            response = requests.get(url, headers=headers)
        elif method == "POST":
            response = requests.post(url, json=data, headers=headers)
        elif method == "PATCH":
            response = requests.patch(url, json=data, headers=headers)
        else:
            raise ValueError("Unsupported method")
        return response
    except Exception as e:
        print(f"Error making request: {e}")
        return None

def main():
    print("Starting NHS Health Backend E2E Workflow Test")

    # Step 0: Create Admin User
    admin_data = {"full_name": "Admin User", "email": "admin@test.com", "password": "admin123", "password2": "admin123", "role": "admin"}
    response = make_request("POST", f"{BASE_URL}/api/auth/users/register/", admin_data)
    if response and response.status_code == 200:
        admin = response.json()
        admin_token = admin['access']
        print_report("Admin user created")
    else:
        print("Failed to create admin user")
        sys.exit(1)

    # Step 1: Create Organization
    org_data = {"name": "Test Hospital"}
    response = make_request("POST", f"{BASE_URL}/api/org/organizations/", org_data, headers={"Authorization": f"Bearer {admin_token}"})
    if response and response.status_code == 201:
        org = response.json()
        org_id = org['id']
        print_report(f"Organization created: {org['name']} (ID: {org_id})")
    else:
        print("Failed to create organization")
        sys.exit(1)

    # Step 2: Create Department
    dept_data = {"name": "Cardiology", "organization": org_id}
    response = make_request("POST", f"{BASE_URL}/api/org/departments/", dept_data, headers={"Authorization": f"Bearer {admin_token}"})
    if response and response.status_code == 201:
        dept = response.json()
        dept_id = dept['id']
        print_report(f"Department created: {dept['name']} (ID: {dept_id})")
    else:
        print("Failed to create department")
        sys.exit(1)

    # Step 3: Create Users
    users = [
        {"full_name": "John Officer", "email": "officer@test.com", "password": "pass123", "password2": "pass123", "role": "officer", "organization": org_id, "department": dept_id},
        {"full_name": "Jane HOD", "email": "hod@test.com", "password": "pass123", "password2": "pass123", "role": "hod", "organization": org_id, "department": dept_id},
        {"full_name": "Bob Store Manager", "email": "store@test.com", "password": "pass123", "password2": "pass123", "role": "store_manager", "organization": org_id, "department": dept_id}
    ]
    tokens = {}
    for user_data in users:
        response = make_request("POST", f"{BASE_URL}/api/auth/users/register/", user_data)
        if response and response.status_code == 200:
            user = response.json()
            tokens[user_data['role']] = user['access']
            print_report(f"User created: {user_data['full_name']} ({user_data['role']})")
        else:
            print(f"Failed to create user {user_data['full_name']}")
            sys.exit(1)

    # Step 4: Create Item, Store, Inventory
    item_data = {"name": "Bandages", "sku": "BND001", "description": "Medical bandages", "organization": org_id}
    response = make_request("POST", f"{BASE_URL}/api/store/items/", item_data, headers={"Authorization": f"Bearer {tokens['officer']}"})
    if response and response.status_code == 201:
        item = response.json()
        item_id = item['id']
        print_report(f"Item created: {item['name']} (ID: {item_id})")
    else:
        print("Failed to create item")
        sys.exit(1)

    store_data = {"name": "Main Store", "contact_email": "store@test.com", "organization": org_id, "is_vendor": False}
    response = make_request("POST", f"{BASE_URL}/api/store/stores/", store_data, headers={"Authorization": f"Bearer {tokens['store_manager']}"})
    if response and response.status_code == 201:
        store = response.json()
        store_id = store['id']
        print_report(f"Store created: {store['name']} (ID: {store_id})")
    else:
        print("Failed to create store")
        sys.exit(1)

    inventory_data = {"item": item_id, "store": store_id, "quantity_available": 100, "reserved_quantity": 0}
    response = make_request("POST", f"{BASE_URL}/api/store/inventories/", inventory_data, headers={"Authorization": f"Bearer {tokens['store_manager']}"})
    if response and response.status_code == 201:
        inventory = response.json()
        inventory_id = inventory['id']
        print_report(f"Inventory created: {inventory['quantity_available']} available")
    else:
        print("Failed to create inventory")
        sys.exit(1)

    # Step 5: Officer submits requisition
    req_data = {"organization": org_id, "department": dept_id, "item": inventory_id, "quantity": 10, "priority": "normal", "reason": "Needed for surgery"}
    response = make_request("POST", f"{BASE_URL}/api/service/requisitions/", req_data, headers={"Authorization": f"Bearer {tokens['officer']}"})
    if response and response.status_code == 201:
        req = response.json()
        req_id = req['id']
        print_report(f"Requisition submitted: ID {req_id}, Status: {req['status']}")
    else:
        print("Failed to submit requisition")
        sys.exit(1)

    # Step 6: HOD approves
    response = make_request("POST", f"{BASE_URL}/api/service/requisitions/{req_id}/approve/", {}, headers={"Authorization": f"Bearer {tokens['hod']}"})
    if response and response.status_code == 200:
        print_report("Requisition approved by HOD")
    else:
        print("Failed to approve requisition")
        sys.exit(1)

    # Step 7: Store Manager reserves
    response = make_request("POST", f"{BASE_URL}/api/service/requisitions/{req_id}/reserve_stock/", {}, headers={"Authorization": f"Bearer {tokens['store_manager']}"})
    if response and response.status_code == 200:
        print_report("Stock reserved by Store Manager")
    else:
        print("Failed to reserve stock")
        sys.exit(1)

    # Step 8: Store Manager delivers
    response = make_request("POST", f"{BASE_URL}/api/service/requisitions/{req_id}/deliver/", {}, headers={"Authorization": f"Bearer {tokens['store_manager']}"})
    if response and response.status_code == 200:
        print_report("Requisition delivered by Store Manager")
    else:
        print("Failed to deliver requisition")
        sys.exit(1)

    # Step 9: HOD verifies
    response = make_request("POST", f"{BASE_URL}/api/service/requisitions/{req_id}/verify/", {}, headers={"Authorization": f"Bearer {tokens['hod']}"})
    if response and response.status_code == 200:
        print_report("Requisition verified and completed by HOD")
    else:
        print("Failed to verify requisition")
        sys.exit(1)

    # Step 10: Check Inventory
    response = make_request("GET", f"{BASE_URL}/api/store/inventories/{inventory_id}/", headers={"Authorization": f"Bearer {tokens['store_manager']}"})
    if response and response.status_code == 200:
        inv = response.json()
        print_report(f"Inventory after: Available {inv['quantity_available']}, Reserved {inv['reserved_quantity']}")
    else:
        print("Failed to check inventory")

    # Step 11: Check Audit Logs
    response = make_request("GET", f"{BASE_URL}/api/service/audit-logs/?object_id={req_id}", headers={"Authorization": f"Bearer {tokens['hod']}"})
    if response and response.status_code == 200:
        logs = response.json()
        print_report("Audit Logs:")
        for log in logs:
            print_report(f"  {log['timestamp']}: {log['action']} by {log['performed_by']['full_name']} - {log['description']}")
    else:
        print("Failed to check audit logs")

    # Step 12: Edge Cases
    # Try to deliver before reserve (but already done, so create another req)
    req_data2 = {"organization": org_id, "department": dept_id, "item": inventory_id, "quantity": 5, "priority": "urgent", "reason": "Test edge"}
    response = make_request("POST", f"{BASE_URL}/api/service/requisitions/", req_data2, headers={"Authorization": f"Bearer {tokens['officer']}"})
    if response and response.status_code == 201:
        req2 = response.json()
        req2_id = req2['id']
        # Approve
        make_request("POST", f"{BASE_URL}/api/service/requisitions/{req2_id}/approve/", {}, headers={"Authorization": f"Bearer {tokens['hod']}"})
        # Try deliver without reserve
        response = make_request("POST", f"{BASE_URL}/api/service/requisitions/{req2_id}/deliver/", {}, headers={"Authorization": f"Bearer {tokens['store_manager']}"})
        if response and response.status_code == 400:
            print_report("Edge case: Deliver before reserve correctly failed")
        else:
            print("Edge case failed")

    print("E2E Test Completed")

if __name__ == "__main__":
    main()
