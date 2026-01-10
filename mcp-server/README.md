# ADTreat MCP Server

MCP (Model Context Protocol) server that serves patient profile data for Alzheimer's grounding conversations.

## Setup

```bash
cd mcp-server
npm install
```

## Running the Server

```bash
npm start
```

Or with auto-reload during development:
```bash
npm run dev
```

## Available Tools

### get_patient_profile

Retrieves complete patient profile for Alzheimer's grounding conversation.

**Input Schema:**
```json
{
  "patient_id": "margaret_chen" | "robert_williams"
}
```

**Output:** Complete patient profile object containing:
- `patient_id` - Unique identifier
- `name` - Full name
- `age` - Patient age
- `preferred_address` - How to address the patient
- `core_identity` - Background and life story
- `safe_place` - Description of their safe/comfortable place
- `comfort_memory` - Memories that bring comfort
- `common_trigger` - What typically causes distress
- `calming_topics` - Array of 5 topics that help calm the patient
- `voice_preference` - Preferred voice type for AI assistant

## Testing

The server uses stdio transport for MCP protocol communication. To test manually, you can use the MCP Inspector or connect from a client application.

## Error Handling

- Invalid `patient_id` returns: `{"error": "Patient not found. Valid IDs: margaret_chen, robert_williams"}`
- Missing `patient_id` returns: `{"error": "patient_id is required", "valid_ids": [...]}`
