FROM maven:3.9.9-eclipse-temurin-17 AS build
WORKDIR /app
COPY . /app
RUN mvn -q -DskipTests package

# Runtime stage
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/target/*.jar /app/app.jar
# Render will set PORT env; app reads server.port=${PORT:8080}
EXPOSE 8080
CMD ["java", "-jar", "/app/app.jar"]
