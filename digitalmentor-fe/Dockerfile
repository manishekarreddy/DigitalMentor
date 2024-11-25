# Step 1: Use an official Node.js image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app/

# Step 2: Copy package.json and package-lock.json (if it exists)
COPY package*.json ./

# Step 3: Install dependencies
RUN npm install

RUN npm install react-router-dom


# Step 4: Copy the rest of the application
COPY public/ ./public
COPY src/ ./src

# Step 5: Expose the port React app will run on
EXPOSE 3000

# Step 6: Add a startup script with a delay
RUN echo -e '#!/bin/sh\nsleep 30\nnpm start' > run-app.sh && chmod +x run-app.sh

# Step 7: Use the startup script as the CMD
CMD ["sh", "run-app.sh"]
