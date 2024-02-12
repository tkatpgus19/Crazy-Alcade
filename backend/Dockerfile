FROM openjdk:17-jdk
VOLUME /tmp
EXPOSE 8081
COPY build/libs/*.jar application.jar
CMD ["java", "-jar", "application.jar"]