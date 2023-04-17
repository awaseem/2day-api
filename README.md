<h1 align="center">2Day 📻</h1>

<p align="center">Transform your writing into engaging AI-generated podcasts. Ditch the mics and sound-proof rooms, and tap into a new audience base without the added effort. 2day converts your blogs and articles into audio podcasts. See it in action <a href="https://listen2day.com">here</a></p>

# Getting started

Install all the dependencies:

```bash
npm install
```

You'll need a few third party services API keys in a new `.env` file within the root of the project.

```bash
# Supabase: You can create a new project here: https://supabase.com/
DATABASE_URL=''
STORAGE_URL=''
SERVICE_KEY=''
BUCKET_NAME=''

# Redis: You can create a cloud hosted redis instance free here: https://upstash.com/
REDIS_URL=''
REDIS_PORT=''
REDIS_PASSWORD=''

# Open AI: You can create your keys for Open AI here: https://platform.openai.com/account/api-keys
OPENAI_API_KEY=''

# 11 Labs: You can create an account here: https://beta.elevenlabs.io
ELEVEN_LABS_API_KEY=''
```

Once all the values are supplied within an `.env`, simply run the following command:

```bash
npm start
```

# Generating content

## 1. Create an account

You'll first need to create an account to do requests to the API:

```bash
curl --request POST \
  --url http://localhost:3000/v1/account
```

The response should be the following:

```json
{
  "accountId": "<ACCOUNT_ID>",
  "apiKey": "<ACCOUNT_API_KEY>"
}
```

## 2. Create a source

You will then need to supply a source for the AI to fetch data from:

```bash
curl --request POST \
  --url http://localhost:3000/v1/source \
  --header 'Content-Type: application/json' \
  --header 'x-account-api-key: <ACCOUNT_API_KEY>' \
  --header 'x-account-id: <ACCOUNT_ID>' \
  --data '{
	"data": [
		{
			"type": "ARTICLE",
			"url": "https://www.readthepeak.com/stories/04-23-are-customer-service-reps-getting-free-goldfish"
		},
		{
			"type": "ARTICLE",
			"url": "https://www.cbc.ca/news/canada/calgary/danielle-smith-media-questions-alberta-politics-1.6812184"
		},
		{
			"type": "ARTICLE",
			"url": "https://www.esquire.com/entertainment/tv/a43518988/pedro-pascal-the-last-of-us-interview-2023/?utm_source=pocket-newtab"
		}
	]
}'
```

The response should be the following:

```json
{
	"id": "216c988b-8092-48f3-afe5-feb58033ab3d", // <= This ID is important as its required when creating a script
	"createdAt": "2023-04-17T03:18:14.819Z",
	"sourceData": [
    // List of all th source you supplied
    ...
	],
  ...
}
```

## 3. Create script

Now you can create a script with the source Id

```bash
curl --request POST \
  --url http://localhost:3000/v1/script \
  --header 'Content-Type: application/json' \
  --header 'x-account-api-key: <ACCOUNT_API_KEY>' \
  --header 'x-account-id: <ACCOUNT_ID>' \
  --data '{
	"sourceId": "216c988b-8092-48f3-afe5-feb58033ab3d"
}'
```

The response should be the following:

```json
{
  "message": "Job started 🚀"
}
```

Now it can take upwards of 1-2 minutes to generate content and voice, you can continue to query the get script endpoint which will always return the most recent script. It takes the source ID as a param

```bash
curl --request GET \
  --url http://localhost:3000/v1/script/216c988b-8092-48f3-afe5-feb58033ab3d \
  --header 'x-account-api-key: <ACCOUNT_API_KEY>' \
  --header 'x-account-id: <ACCOUNT_ID>' \
```
