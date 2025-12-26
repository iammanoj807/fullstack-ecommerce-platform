# Use Maven with JDK 17 for building
FROM maven:3.9-eclipse-temurin-17-alpine as build

# Set working directory
WORKDIR /app

# Copy pom.xml first (for dependency caching)
COPY pom.xml .

# Download dependencies (cached layer)
RUN mvn dependency:go-offline -B

# Copy source code
COPY src src

# Build the application
RUN mvn package -DskipTests

# Production stage - use slim JRE
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Copy the built JAR from build stage
COPY --from=build /app/target/*.jar app.jar

# Expose port (Render uses PORT env variable)
EXPOSE 8081

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
