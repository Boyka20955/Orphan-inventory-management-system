#!/bin/bash

# Base URL for the healthRecord API
BASE_URL="http://localhost:3000/api/healthRecord"

# Example token for authentication (replace with a valid token)
TOKEN="your_auth_token_here"

# Helper function to make authenticated requests
auth_curl() {
  curl -s -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" "$@"
}

echo "Testing GET all health records"
auth_curl -X GET "$BASE_URL"

echo "Testing GET health records by child ID"
CHILD_ID="example_child_id"
auth_curl -X GET "$BASE_URL/child/$CHILD_ID"

echo "Testing GET health record by ID"
RECORD_ID="example_record_id"
auth_curl -X GET "$BASE_URL/$RECORD_ID"

echo "Testing POST create health record"
auth_curl -X POST "$BASE_URL" -d '{
  "childId": "example_child_id",
  "recordType": "checkup",
  "date": "2024-01-01",
  "description": "Routine checkup",
  "doctor": "Dr. Smith"
}'

echo "Testing PUT update health record"
auth_curl -X PUT "$BASE_URL/$RECORD_ID" -d '{
  "description": "Updated description"
}'

echo "Testing DELETE health record"
auth_curl -X DELETE "$BASE_URL/$RECORD_ID"

echo "Health record API tests completed."
