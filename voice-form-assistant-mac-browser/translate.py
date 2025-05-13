from transformers import M2M100ForConditionalGeneration, M2M100Tokenizer

tokenizer = M2M100Tokenizer.from_pretrained("facebook/m2m100_418M")
model = M2M100ForConditionalGeneration.from_pretrained("facebook/m2m100_418M")

def translate_to_english(text, source_lang_code):
    tokenizer.src_lang = source_lang_code
    encoded = tokenizer(text, return_tensors="pt")
    generated_tokens = model.generate(
        **encoded, forced_bos_token_id=tokenizer.get_lang_id("en")
    )
    return tokenizer.decode(generated_tokens[0], skip_special_tokens=True)