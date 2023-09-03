# Use the official Node.js image as the base image
FROM node:14

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install the application's dependencies inside the container
RUN npm install

# Copy the rest of the application code into the container
COPY . .

# Remove node_modules from local and install dependencies in the container
RUN rm -rf node_modules && npm install

# Expose port 3000 (or the port your app runs on) to be accessed outside the container
EXPOSE 3000 3001

# Command to run the application
CMD ["npm", "run", "start:docker"]
