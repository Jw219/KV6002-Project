import os
import sys
from mailjet_rest import Client #mailjet_rest import
from dotenv import load_dotenv # python-dotenv import

# Load environment variables from .env file
load_dotenv()

# apart from recipient bc we will change it
#os.environ['RECIPIENT_EMAIL'] = "swedishikeamonkey@outlook.com"
# Retrieve environment variables
api_key = os.getenv('MJ_APIKEY_PUBLIC')
api_secret = os.getenv('MJ_APIKEY_PRIVATE')
sender_email = os.getenv('SENDER_EMAIL')
#diff to others bc not retrieved from env
recipient_email = sys.argv[1]  # The email is passed as the first argument

# Initialize Mailjet client
mailjet = Client(auth=(api_key, api_secret), version='v3.1')

# Email data
data = {
    'Messages': [
        {
            "From": {
                "Email": sender_email,
                "Name": "legitimate business interest"
            },
            "To": [
                {
                    "Email": recipient_email,
                    "Name": "You"
                }
            ],
            "Subject": "Legitimate Business email",
            "TextPart": "this is a definite business email please click this link",
            "HTMLPart": "<h3>this is a good idea to click this <a href=\"http://localhost:5001/netninja/phishingFail.html\">here</a>!</h3><br />",
            "TrackOpens": "enabled",  # Enable open tracking
            "TrackClicks": "enabled"  # track if the user clicks the bad link
        }
    ]
}

# Send email
result = mailjet.send.create(data=data)

# Print results
print("Send Status Code:", result.status_code)
send_response = result.json()
print("Send Response:", send_response)

if result.status_code == 200:
    message_id = send_response['Messages'][0]['To'][0]['MessageID']
    print(f"Message sent successfully. MessageID: {message_id}")
    # Save the MessageID to a file for later use
    with open("message_id.txt", "w") as file:
        file.write(str(message_id))
else:
    print("Failed to send email")
