# Use the official Python image from the Docker Hub as the base image
FROM python:3.10-slim

# Set the working directory inside the Docker container
WORKDIR /app

# Copy only the requirements file first, to leverage Docker's caching mechanism
COPY requirements.txt .

# Install the dependencies specified in the requirements.txt file
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code to the working directory
COPY . .

# Define the PORT environment variable, defaulting to 8080 if not set
ENV PORT 8080

# Expose the port defined by the PORT environment variable
EXPOSE $PORT

# Command to run the application using Uvicorn, using the PORT environment variable
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port $PORT"]