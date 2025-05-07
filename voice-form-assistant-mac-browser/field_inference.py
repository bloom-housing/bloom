def infer_fields(entities):
    inferred = {
        "Applicant Name": None,
        "Preferred Location": None,
        "Budget": None,
        "Bedrooms Needed": None
    }
    
    for ent in entities:
        label = ent["entity_group"]
        text = ent["word"]
        
        if label == "PER":
            inferred["Applicant Name"] = inferred["Applicant Name"] or text
        elif label in {"LOC", "GPE"}:
            inferred["Preferred Location"] = inferred["Preferred Location"] or text
        elif label == "MONEY":
            inferred["Budget"] = inferred["Budget"] or text
        elif "bedroom" in text.lower() or text.isdigit():
            if int(text) in [1, 2, 3, 4]:
                inferred["Bedrooms Needed"] = text
    return inferred