FROM node:18

# Create app directory.
WORKDIR /app

# Install all dependencies.
COPY package*.json ./
RUN npm ci --only=production

# Bundle app source
COPY . .

# Expose port 3000.
EXPOSE 3000

# Start the server.
CMD [ "npm", "run", "start" ]