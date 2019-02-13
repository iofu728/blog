FROM gradle:4.10.0-jdk8 as jar

WORKDIR /usr/local/wyydsb/blog/blog-backend

COPY . .

USER root

RUN gradle build -x test

FROM openjdk:8-jre-alpine

WORKDIR /usr/local/www

EXPOSE 8848

COPY --from=jar /usr/local/wyydsb/blog/blog-backend/blog-collector/build/libs/blog-collector-4.3.0-SNAPSHOT.jar /usr/local/www

ENTRYPOINT ["/usr/bin/java", "java","-jar","/usr/local/www/blog-collector-4.3.0-SNAPSHOT.jar"]