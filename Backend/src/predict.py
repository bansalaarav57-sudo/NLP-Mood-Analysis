from services.predictor import predict

while True:

    review = input("Enter Review : ")

    if review.lower()=="exit":
        break

    result = predict(review)

    print(result)