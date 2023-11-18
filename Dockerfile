# Use the official Node.js LTS image as the base image
FROM node:lts

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port on which your Express app listens (replace 3000 with your actual port)
EXPOSE 3000

# Start the Express app (replace 'start' with your actual script to start the app)
CMD ["npm", "start"]
