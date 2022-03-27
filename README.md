# Qualified Tutors

This repository acts as a monorepo for the entire Qualified Tutors project.

## Project Structure

- frontend/
    - Contains the React SPA users pull up in their browser
- backend/
    - Houses the Laravel REST API the frontend accesses data through
- iac/
    - Holds the AWS CDK code neccessary for provisioning the staging & production infrastructure for both the SPA & API
- scripts/
    - Contains build scripts that manage the CI/CD process
- .github/
    - Definitions for the github actions used in the CI/CD process
- ./package.json
    - Provides an entry point for running CI/CD commands via npm

## Required 3rd Party Services

- Github
    - Hosts this repository & serves as an execution platform for the CI/CD processes via Github Actions
    - Stores critital application secrets & other environmental configuration
- AWS
    - @see https://portal.aws.amazon.com/billing/signup
    - Used to provision the underlying infrastructure for the application
    - Utilizes:
        - Elastic Beanstalk
        - RDS
        - Cloudfront
        - S3
    - An access key/secret must be set in backend/.env (for local dev) and stored as a Github repository secret (for staging & prod)
- Twilio SendGrid
    - @see https://signup.sendgrid.com/
    - Used to send templated emails & SMS messages 
    - Key required in backend/.env (for local dev env) & stored as a Github repository secret (for staging & prod)
    - The dynamic template IDs for every type of templated email dispatched by the platform must be inserted into  backend/.env* (See below)
- Google reCAPTCHA
    - @see https://www.google.com/recaptcha/admin
    - Used to protect the contact us form
    - Secret key required in backend/.env (for local dev env) & stored as a Github repository secret (for staging & prod)
    - Site key required in frontend/.env
- Google Geocoding API
    - @see https://developers.google.com/maps/documentation/geocoding/cloud-setup
    - Used to translate & cache tutor addresses to lat/lng for use in Haversine distance calculations
    - Key required in backend/.env (for local dev env) & stored as a Github repository secret (for staging & prod)
- Google Maps Embed API
    - @see https://developers.google.com/maps/documentation/embed/cloud-setup
    - Used to embed an interactive map on agency profile pages
    - Key required in frontend/.env (for local dev env) & stored as a Github repository secret (for staging & prod)
- Google Maps JavaScript API
    - @see https://developers.google.com/maps/documentation/javascript/cloud-setup
    - Used for location suggestion on the Find a Tutor page
    - Key required in frontend/.env (for local dev env) & stored as a Github repository secret (for staging & prod)

## Initial Deployment Steps
### Step 1: AWS console
- Create a hosted zone in Route 53 for your domain
    - https://console.aws.amazon.com/route53/v2/hostedzones#CreateHostedZone
- Update your domains nameservers with your current domain provider to point to those of your hosted zone
    - https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/GetInfoAboutHostedZone.html
- The main A record of your hosted zone will direct to the frontend. Create additional A records for api.SITENAME.TLD, staging.SITENAME.TLD, and staging-api.SITENAME.TLD
- Request two wildcard SSL certificates for your hosted zone-- one hosted in us-east-1 and the other in the region you'll be deploying the main application servers (eu-west-2?) using AWS Certificate Manager & get them validated
    - ***IMPORTANT!*** Only certificates issued from the N. Virgina US-East-1 region can be used with Cloudfront. Be sure one of the certs is issued here. Conversley application load balancers can only work with certs in their same datacenter so make sure the other is there.
    - https://us-east-1.console.aws.amazon.com/acm/home?region=us-east-1#/certificates/request
- Create two Access keys using IAM
    - https://console.aws.amazon.com/iamv2/home#/users
    - ^ select a user, from the users Summary select the Security credentials tab, click the "Create access key" button
    - One if for the production environment, the other is for staging
- Create two SSH keys using EC2 (one for the backend, one for the ssh bastion) for each environment (4 total-- none are needed for the local dev env)
    - https://console.aws.amazon.com/ec2/v2/home#KeyPairs:
    - Do not carelessly store or distribute these, they can be used to compromise the entire application
- Create two S3 buckets per environment (6 total)
    - One of each pair will house publicly available assets (user profile pictures etc.)
        - Make sure to untick `Block all public access` when creating this bucket
        - Under this buckets permission settings include the CORS config below
    - The other will house private assets (tutor qualification documents, etc.)
        - Make sure to leave `Block all public access` ticked when creating this bucket
        - Under this buckets permission settings include the below CORS config
    - These are not created via CDK to avoid the possiblity of them being automatically deleted/replaced resulting in lost user data
    - CORS config for the buckets:
```
[
    {
        "AllowedHeaders": [
            "*"
        ],
        "AllowedMethods": [
            "HEAD",
            "GET"
        ],
        "AllowedOrigins": [
            "http://localhost:3000",
            "http://localhost:45678",
            "https://staging.kesso.uk",
            "https://www.kesso.uk",
            "https://kesso.uk",
            "https://staging.qualifiedtutors.co.uk",
            "https://qualifiedtutors.co.uk",
        ],
        "ExposeHeaders": [
            "Access-Control-Allow-Origin"
        ]
    }
]
```

### Step 2: CLI
- Install git
    - https://git-scm.com/downloads
- Install the AWS CLI tools & run `aws configure`
    - https://aws.amazon.com/cli/
- Install the AWS CDK Toolkit
    - https://docs.aws.amazon.com/cdk/v2/guide/cli.html
- Install NodeJS
    - https://nodejs.org/en/
- Clone this repository
- Edit the .env.prod file in the toplevel directory, enter values for everything in there
- From the root (/) directory run: `npm run provision-prod-infrastructure`
- Point the main A record of your Route53 hosted zone to the Cloudfront distribution generated by the previous step
- Point the api. A record to the Elastic Beanstalk environment generated by the previous step

### Step 3: Github repository settings
- Set the following repository secrets
    - AWS_REGION
    - AWS_ACCESS_KEY_ID
    - AWS_SECRET_ACCESS_KEY
    - S3_FRONTEND_BUCKET
    - CLOUDFRONT_DIST_ID
    - EBS_APP_NAME
    - EBS_ENV_NAME
    - APP_KEY
    - RDS_HOST
    - RDS_PSWD
    - S3_PUBLIC_BUCKET
    - S3_PUBLIC_BUCKET_URL
    - S3_PRIVATE_BUCKET
    - S3_PRIVATE_BUCKET_URL
    - SENDGRID_API_KEY
    - GOOGLE_API_KEY
    - GOOGLE_RECAPTCHA_SECRET_KEY
    - REACT_APP_GOOGLE_RECAPTCHA_KEY
    - REACT_APP_GOOGLE_MAPS_KEY
    - REACT_APP_GOOGLE_ANALYTICS_ID
    - STAGING_AWS_REGION
    - STAGING_AWS_ACCESS_KEY_ID
    - STAGING_AWS_SECRET_ACCESS_KEY
    - STAGING_S3_FRONTEND_BUCKET
    - STAGING_CLOUDFRONT_DIST_ID
    - STAGING_EBS_APP_NAME
    - STAGING_EBS_ENV_NAME
    - STAGING_APP_KEY
    - STAGING_RDS_HOST
    - STAGING_RDS_PSWD
    - STAGING_S3_PUBLIC_BUCKET
    - STAGING_S3_PUBLIC_BUCKET_URL
    - STAGING_S3_PRIVATE_BUCKET
    - STAGING_S3_PRIVATE_BUCKET_URL
    - STAGING_SENDGRID_API_KEY
    - STAGING_GOOGLE_API_KEY
    - STAGING_GOOGLE_RECAPTCHA_SECRET_KEY
    - STAGING_REACT_APP_GOOGLE_RECAPTCHA_KEY
    - STAGING_REACT_APP_GOOGLE_MAPS_KEY
    - STAGING_REACT_APP_GOOGLE_ANALYTICS_ID
- Run the `Deploy API to Prod` action
- Run the `Deploy SPA to Prod` action
- Connect to the SSH bastion host and from there the API webserver instance and run the following commands:
    - `cd /var/www/html`
    - `php artisan migrate`
    - `php artisan db:seed`
- Edit the backend/.env file and add:
    - ROOT_ADMIN_EMAIL=MAIN_ADMIN_EMAIL_HERE@PROVIDER.COM
    - ROOT_ADMIN_PSWD=AVerySecureAndComplexPassword
- Run: `php artisan db:seed --class=RootUserSeeder`
- Edit the backend/.env file and remove the two lines you added
- At this point the site should be working

## Development
- Ensure you're running the installation prerequisites from the CLI step above as well as:    
    - Install PHP
        - https://www.php.net/downloads
    - Install Composer
        - https://getcomposer.org/download/
    - Install MariaDB Community Server
        - https://mariadb.com/downloads/
- If you haven't already done so, clone the repository 
    - In this case also run:
        - copy backend/.env.dev to backend/.env
            - Edit it an set ROOT_ADMIN_EMAIL & ROOT_ADMIN_PSWD 
        - `cd backend && composer install && php artisan migrate && php artisan db:seed && php artisan db:seed --class=FakeStudentSeeder && php artisan db:seed --class=FakeTutorSeeder && php artisan db:seed --class=FakeReviewSeederSeeder && php artisan db:seed --class=FakeFaqsSeeder && php artisan db:seed --class=FakeAnalyticsSeeder && php artisan db:seed --class=RootUserSeeder`
        - `cd frontend && npm install`
- Run: `git fetch`
- Ensure you're on the main branch: `git checkout main`
- Create a new branch for your work: `git checkout -b branch-name-for-your-work`
- Run the backend: `cd backend && php artisan serve`
- Run the frontend: `cd frontend && npm run start`
- Make whatever changes are necessary
    - See backend/README.md & frontend/README.md
- Commit your work to your branch
- Push the branch to the remote origin
- Open a PR from your branch to the staging branch
- Merge the PR
- Run the `Provision Staging Infrastucture` action and ensure it completes successfully
- Update the Route53 entries for the staging subdomains
- Update the cloudfront dist id secret for staging with the newly generated id from the provision action
- Run the `Deploy API to Staging` action and ensure it completes successfully
- Run the `Deploy SPA to Staging` action and ensure it completes successfully
- Have the work reviewed in staging
- Repeat the process until things are ready to go live
- Once things are approved in staging run the `Destroy Staging Infrastructure` action
- Open a PR from staging to main
- Merge the PR
- Ensure the Deploy to Prod action completes successfully
- Ensure the prod env is functioning correctly and your changes are present

## Direct server access
- The VPC running the infrastructure is intentionally very locked down to prevent a host of potential attack types. 
    - No public access to the database of any kind is available
    - The API webserver is on a private subnet with the database server and is the only thing that can connect to it
    - The API webserver runs an SSH server but only accepts connections from the the private subnet
    - There is an SSH bastion host on the private subnet that accepts connections from the internet
- tl;dr: SSH into the bastion host, SSH from the bastion host to the API webserver, connect to the database server from there. This requires both SSH keys provisioned for deployment-- one on your machine, and one on the bastion host.
    - If you're just looking for SQL access to the staging or prod database MySQL Workbench can configure connections through SSH bastions.
- When not in use the SSH bastion should be shut down from the AWS EC2 console, for both security and cost savings.

## Email Notifications
- Email notification templating is handled by Sendgrids Dynamic Templates feature
- For each of the following a Sendgrid dynamic template is required. Listed below the notificaiton type are the variables sent to the template that can be inserted using {{handlebars syntax}}. 
    - @see https://docs.sendgrid.com/ui/sending-email/how-to-send-an-email-with-dynamic-transactional-templates
    - @see https://docs.sendgrid.com/for-developers/sending-email/using-handlebars
- The ID of each template must be inserted into backend/.env*. 
- Types: (all templates are sent __name containing the targeted users name)
    - NEWTUTOR (Sent to admins when a new tutor completes their profile and wants to go live)
        - tutor_name
        - tutor_email
        - link (URL leading to the pending tutor registration)
    - EMAILVALIDATION (Sent to users to validate their email address after signing up)
        - link (URL that will validate email)
    - TUTORAPPROVED (Sent to a tutor when their registration has been approved)
    - TUTORREJECTED (Sent to a tutor when their registration has been rejected)
    - SUBJECTAPPROVED (Sent to tutors when an admin approves a new subject they've entered)
        - subject
    - SUBJECTRENAMED (Sent to tutors when an admin approves a new subject they've entered but changed its name)
        - subject
        - new_name
    - SUBJECTREMAPPED (Sent to tutors when an admin approves a new subject they've entered but remaps it to an existing subject)
        - subject
        - existing_subject
    - SUBJECTREJECTED (Sent to tutors when an admin rejects a new subject they've entered)
        - subject
    - MESSAGERECEIVED (Sent to users when they receive a new message)
        - from
        - message
    - FAILEDADDRESSLOOKUP (Sent to users when their address fails to resolve to a set of lat/lng coords)
        - address_line_1
        - address_line_2
        - county
        - city
        - postcode
    - NEWSUBJECTS (Sent to admins when a tutor enters an unrecognized subject)
        - tutor_name
        - tutor_email
        - new_subjects
    - REFERENCEAPPROVED (Sent to a tutor when an admin approves one of their references)
        - reference_name
        - reference_email
        - reference_relationship
    - REFERENCEREJECTED (Sent to a tutor when an admin rejects one of their references)
        - reference_name
        - reference_email
        - reference_relationship
    - REFERENCENOCONTACT (Sent to a tutor when an admin marks one of their references as uncontactable)
        - reference_name
        - reference_email
        - reference_relationship
    - REGISTRATIONINQUIRY (Sent to a tutor when an admin opts to send an email while reviewing a registration)
        - message
    - REVIEWSUBMITTED (Sent to a tutor when someone submits a review of them)
        - reviewer
        - subject
        - level
        - approve_url (URL to approve the review)
        - reject_url (URL to reject the review)
    - REVIEWREJECTED (Sent to students when a tutor uses the reject_url to reject a review)
        - tutor
        - rejection_message
        - subject
        - level
        - escalate_url (allows the student to dispute the rejection and have an admin review)
    - FORGOTPASSWORD (Sent when users fill out the forgot password form)
        - link (URL that lets users access the password reset form)
    - CONTACTUS (Sent to the address defined in backend/.env when users fill out the contact us form)
        - message
    - MOREREGISTRATIONINFO_ACCOUNT
        - message
    - MOREREGISTRATIONINFO_ADDRESS
        - message
    - MOREREGISTRATIONINFO_SUBJECTS
        - message
    - MOREREGISTRATIONINFO_QUALIFICATIONS
        - message
    - MOREREGISTRATIONINFO_PROFILE
        - message
    - MOREREGISTRATIONINFO_PHOTOS
        - message
    - MOREREGISTRATIONINFO_DOCUMENTS
        - message
    - MOREREGISTRATIONINFO_AVAILABILITY
        - message
    - MOREREGISTRATIONINFO_REFERENCES
        - message
    - MASSEMAIL (Sent when admins select multiple users & email them from User Management)
        - message
    - CONTACT_REFERENCE (Sent to potential referees when a tutor submits a reference)
        - user_name (name of the tutor who submitted the reference)
        - reference_name (name of the potential referee)
        - link (URL to access the reference form)
    - REFERENCE_SUBMITTED (Sent to admins when a reference fills out the reference form)
        - tutor
        - tutor_email
        - title
        - name
        - surname
        - email
        - school
        - addressLine1
        - addressLine2
        - town
        - postcode
        - phone
        - howLong
        - howDoYouKnow
        - confident
        - rating
        - professionalism
        - managementSkills
        - reliability
        - trustworthyness
        - comments

## SMS Notifications
- SMS notifications are available for all of the types outlined above
- They are delivered through Twilio
- The are templated using the Blade templates under backend/resources/views/sms
    - @see https://laravel.com/docs/8.x/blade