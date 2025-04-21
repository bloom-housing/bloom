# Document Processing Pipeline

def process_document(document, target_language, simplification_level):
    """
    Main processing pipeline for documents
    
    Parameters:
    - document: Input housing document (PDF, DOCX, etc.)
    - target_language: Language code for output
    - simplification_level: 1-5 scale (1=least simplified, 5=most simplified)
    
    Returns:
    - Simplified document in target language
    """
    # Step 1: Parse and segment document
    sections = document_parser.parse(document)
    
    # Step 2: Classify document sections
    classified_sections = []
    for section in sections:
        section_type = document_classifier.classify(section)
        classified_sections.append((section, section_type))
    
    # Step 3: Simplify content with LLM
    simplified_sections = []
    for section, section_type in classified_sections:
        # Apply appropriate simplification rules based on section type
        rules = rule_engine.get_rules(section_type)
        
        # Generate prompt with relevant context and rules
        prompt = generate_simplification_prompt(
            text=section,
            rules=rules,
            level=simplification_level
        )
        
        # Process with local LLM
        simplified_text = simplification_llm.generate(prompt)
        
        # Validate legal accuracy
        legal_validation = legal_checker.validate(
            original=section,
            simplified=simplified_text,
            section_type=section_type
        )
        
        if not legal_validation.is_valid:
            # Apply corrections based on validation feedback
            simplified_text = legal_checker.correct(
                simplified_text, 
                legal_validation.issues
            )
        
        simplified_sections.append(simplified_text)
    
    # Step 4: Translate if needed
    if target_language != "en":
        translated_sections = []
        for section in simplified_sections:
            translated = translation_model.translate(
                text=section,
                source_lang="en",
                target_lang=target_language
            )
            
            # Apply cultural adaptation
            adapted = cultural_adapter.adapt(
                text=translated,
                target_culture=target_language
            )
            
            # Quality check the translation
            quality_score = translation_qc.check(
                source=section,
                translation=adapted
            )
            
            if quality_score < QUALITY_THRESHOLD:
                adapted = translation_qc.suggest_improvements(
                    source=section,
                    translation=adapted
                )
            
            translated_sections.append(adapted)
        simplified_sections = translated_sections
    
    # Step 5: Format the document
    formatted_doc = document_formatter.format(
        sections=simplified_sections,
        original_doc=document
    )
    
    return formatted_doc


# Simplification LLM with Context-Aware Prompting
def generate_simplification_prompt(text, rules, level):
    """Generate an effective prompt for the simplification LLM"""
    # Extract key terms that need definition
    complex_terms = term_extractor.extract(text)
    term_definitions = term_db.lookup(complex_terms)
    
    # Get relevant policy context
    policy_context = policy_db.get_relevant_policies(text)
    
    # Construct prompt based on simplification level
    system_prompt = f"""
    Simplify the following housing document text to reading level {level}.
    
    Rules to follow:
    {rules}
    
    Key terms to preserve or explain:
    {term_definitions}
    
    Relevant policies to consider:
    {policy_context}
    
    Important: Maintain all legal requirements and obligations while making the language more accessible.
    """
    
    return {
        "system": system_prompt,
        "user": f"Text to simplify: {text}"
    }


# Legal Validation Module
class LegalChecker:
    def validate(self, original, simplified, section_type):
        """
        Validate that simplified text maintains legal meaning
        Returns validation result with any issues found
        """
        # Get legal requirements for this section type
        requirements = self.get_legal_requirements(section_type)
        
        # Check for each requirement in simplified text
        issues = []
        for req in requirements:
            if not self.requirement_satisfied(simplified, req):
                issues.append({
                    "requirement": req,
                    "explanation": f"Missing or altered legal requirement: {req}"
                })
        
        # Check for preservation of critical terms
        critical_terms = self.extract_critical_terms(original)
        for term in critical_terms:
            if not self.term_preserved(simplified, term):
                issues.append({
                    "requirement": f"Preserve term: {term}",
                    "explanation": f"Critical term not preserved: {term}"
                })
        
        return ValidationResult(
            is_valid=len(issues) == 0,
            issues=issues
        )
    
    def correct(self, simplified_text, issues):
        """
        Correct legal issues in simplified text
        Returns corrected text
        """
        # Generate correction prompt
        correction_prompt = {
            "system": "You are a legal document corrector. Fix the following simplified text to address the legal issues while maintaining simplicity.",
            "user": f"""
            Simplified text: {simplified_text}
            
            Issues to fix:
            {self._format_issues(issues)}
            
            Return the corrected text that addresses all issues while maintaining simplicity.
            """
        }
        
        # Get corrected text from LLM
        corrected = legal_correction_llm.generate(correction_prompt)
        return corrected
