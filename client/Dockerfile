# Use a Node.js image for development
FROM node:16-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port your development server runs on
EXPOSE 3000

# Set the command to run the development server
CMD ["npm", "start"]
