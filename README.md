# Google Docs Clone

## Overview

This application implements a real-time collaborative document editing platform inspired by Google Docs. It enables multiple users to simultaneously edit documents with changes reflected instantaneously across all connected clients.

## Technical Architecture

### Frontend Technologies
- **React**: Powers the user interface with efficient component rendering
- **Quill.js**: Provides rich text editing capabilities with customizable formatting options
- **Socket.IO Client**: Establishes WebSocket connections for real-time data synchronization

### Backend Technologies
- **Node.js**: Runtime environment for server-side JavaScript execution
- **Express**: Web application framework for routing and middleware implementation
- **Socket.IO Server**: Manages bidirectional communication channels with clients
- **MongoDB**: NoSQL database for document persistence and retrieval

## Core Functionality

- **Real-time Collaboration**: Multiple users can edit the same document simultaneously
- **Document Persistence**: Automatic saving of document content to MongoDB
- **Unique Document IDs**: Generated via UUID and accessible through URL parameters
- **Rich Text Formatting**: Support for headings, lists, text styling, and other formatting options
- **Cursor Synchronization**: Visual indicators of other users' cursor positions and selections

## Project Visualization

[View on Eraser![](https://app.eraser.io/workspace/zA39QLojQ0sSV6NcQTZJ/preview?elements=_oQOv6VH0t0wjQInKd1VTg&type=embed)]()

*The architecture diagram illustrates the data flow between client components, server services, and database interactions.*

## Demo

<<<<<<< HEAD
=======
https://github.com/user-attachments/assets/2944abc4-88f1-499d-94b8-2f7d03943183

>>>>>>> 8a6d32d3edb3669862873e7036d89b69dfbd5948

## Installation and Configuration

### Prerequisites
- Node.js (v14.0.0+)
- MongoDB (v4.0.0+)
- npm (v6.0.0+)

### Server Setup
```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env

# Edit .env file with your MongoDB connection string
# MONGODB_URI=mongodb://localhost:27017/docsclone

# Start the server
npm run dev
```

### Client Setup
```bash
# Navigate to client directory
cd client

# Install dependencies
npm install

# Start the development server
npm run dev
```

## Deployment

### Production Build
```bash
# Build client
cd client
npm run build

# Configure production environment
cd ../server
NODE_ENV=production npm start
```

### Deployment Options
- **Heroku**: Deploy using Procfile and environment variables
- **Docker**: Containerize application using provided Dockerfile
- **AWS**: Deploy using Elastic Beanstalk or EC2 instances

## Security Considerations

- All WebSocket connections are authenticated using session tokens
- Document access is restricted based on user permissions
- Input sanitization prevents XSS attacks via document content
- Rate limiting prevents abuse of real-time synchronization features

## Future Enhancements

- User authentication and document ownership
- Comment functionality
- Version history and document restore points
- Offline editing with synchronization upon reconnection
- File attachment support

## License

MIT License

Copyright (c) 2025

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files.
