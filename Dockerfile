FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first to cache dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Typescript code
RUN npm run build

# Expose the API port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
