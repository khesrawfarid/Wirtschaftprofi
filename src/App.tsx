const startLearningJourney = async () => {
  setIsLoading(true);

  try {
    const q = await generateQuestions(
      plan.subject.topic || plan.subject.name,
      `${plan.subject.curriculumLevel}. Klasse`,
      10,
      plan.subject.name
    );

    if (!Array.isArray(q)) {
      throw new Error("Ungültiges Fragen-Format von Gemini");
    } 

    setQuestions(q);
    setCurrentQuestionIndex(0);
    setProgress(prev => ({ ...prev, gameScore: 0, postTestScore: null }));
    setState('game');

  } catch (error: any) {
    console.error(error);

    alert(
      "Ups! Problem beim Generieren der Fragen:\n" +
      (error?.message || "Unbekannter Fehler")
    );

  } finally {
    setIsLoading(false);
  }
};
