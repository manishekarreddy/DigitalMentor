@echo off

:: Step 1: Create Dockerfile for development (React on port 3000)

echo Creating Dockerfile for React development...

(
echo # Step 1: Use an official Node.js image for development
echo FROM node:16
echo.
echo # Set working directory
echo WORKDIR /app
echo.
echo # Copy package.json and package-lock.json (if available)
echo COPY package*.json ./
echo.
echo # Install dependencies
echo RUN npm install
echo.
echo # Copy the rest of the React application
echo COPY . .
echo.
echo # Expose port 3000
echo EXPOSE 3000
echo.
echo # Start the React development server
echo CMD ["npm", "start"]
) > Dockerfile

echo Dockerfile for React development created successfully!

:: Step 2: Build the Docker image

echo Building the Docker image...

docker build -t react-app-dev .

:: Step 3: Run the Docker container on port 3000

echo Running the Docker container...

docker run -p 3000:3000 react-app-dev

:: Done
echo Dockerized React app is now running on http://localhost:3000
pause
