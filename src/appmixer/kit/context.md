# Kit (formerly ConvertKit) Connector Context

## About Kit
Kit is an email marketing platform designed for creators. It provides tools for building email lists, creating automated email sequences, managing subscribers, and tracking email performance. Key features include subscriber management, email broadcasts, automated sequences, forms, landing pages, and detailed analytics.

## API Information
- **Base URL**: `https://api.kit.com/v4/`
- **API Version**: v4 (latest)
- **Documentation**: https://developers.kit.com/api-reference/overview
- **Authentication**: API Key authentication (X-Kit-Api-Key header) and OAuth 2.0

## Authentication Methods

### API Key Authentication
- Uses `X-Kit-Api-Key` header
- API keys can be created in developer settings: https://app.kit.com/account_settings/developer_settings
- Rate limit: 120 requests per 60-second rolling period per API key
- Usage: Simple tools and integrations for personal account automation

**How to obtain API Key:**
1. Sign in to your Kit account
2. Go to Account Settings > Developer Settings
3. Create a new V4 API Key
4. Copy the generated key (format: `kit_abc123`)

### OAuth 2.0 Authentication (Optional)
- Used for apps available in the Kit App Store
- Authorization URL: `https://app.kit.com/oauth/authorize`
- Token URL: `https://app.kit.com/oauth/token`
- Rate limit: 600 requests per 60-second rolling period per access token
- Supports both web server flow and SPA/mobile PKCE flow

## Planned Components

Based on the API capabilities and common email marketing workflows, the following components should be implemented:

### Core Subscriber Management
1. **ListSubscribers** - List subscribers with filtering and pagination
2. **CreateSubscriber** - Create or update a subscriber (upsert behavior)
3. **GetSubscriber** - Get subscriber details by ID
4. **UpdateSubscriber** - Update subscriber information
5. **UnsubscribeSubscriber** - Unsubscribe a subscriber

### Tag Management
6. **ListTags** - List all tags
7. **CreateTag** - Create a new tag
8. **TagSubscriber** - Add tag to subscriber by email or ID
9. **RemoveTagFromSubscriber** - Remove tag from subscriber
10. **ListSubscribersForTag** - List subscribers with a specific tag

### Form Management
11. **ListForms** - List all forms and landing pages
12. **AddSubscriberToForm** - Add subscriber to form (triggers sequences)
13. **ListSubscribersForForm** - List subscribers for a specific form

### Sequence (Course) Management
14. **ListSequences** - List all sequences/courses
15. **AddSubscriberToSequence** - Add subscriber to a sequence
16. **ListSubscribersForSequence** - List subscribers for a sequence

### Broadcast Management
17. **ListBroadcasts** - List all broadcasts (including drafts, scheduled, sent)
18. **CreateBroadcast** - Create a new broadcast (draft or scheduled)
19. **GetBroadcast** - Get broadcast details
20. **UpdateBroadcast** - Update broadcast content/settings
21. **DeleteBroadcast** - Delete a broadcast
22. **GetBroadcastStats** - Get broadcast statistics

### Custom Fields
23. **ListCustomFields** - List all custom fields
24. **CreateCustomField** - Create a new custom field

### Account & Analytics
25. **GetAccount** - Get current account information
26. **GetGrowthStats** - Get subscriber growth statistics
27. **GetEmailStats** - Get email performance statistics

### Segments
28. **ListSegments** - List all subscriber segments

### Advanced Operations
29. **ListPurchases** - List purchase data (OAuth only)
30. **CreatePurchase** - Record a purchase (OAuth only)

## Key API Features

### Filtering & Sorting
- Subscribers can be filtered by status, creation date, email address
- Various sorting options available (id, updated_at, cancelled_at)
- Date filtering uses YYYY-MM-DD format
