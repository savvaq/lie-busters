import { useMemo } from 'react';
import { RoundWithRelations, VoteOption } from '@/lib/types';
import shuffleArray from '@/helpers/shuffleArray';

const useOptions = (round: RoundWithRelations) => {
  return useMemo(() => {
    let options: VoteOption[] = round.answers.map((answer) => ({
      id: answer.id,
      value: answer.value,
      players: [],
    }));

    // Remove duplicates
    options = options.filter(
      (option, index, self) =>
        index ===
        self.findIndex(
          (a) => a.value.toLowerCase() === option.value.toLowerCase()
        )
    );

    // Populate players
    round.answers.forEach((answer) => {
      const option = options.find(
        (option) => option.value.toLowerCase() === answer.value.toLowerCase()
      );

      if (option) {
        option.players.push(answer.player);
      }
    });

    const optionsIncludeCorrectAnswer = options.some(
      (option) =>
        option.value.toLowerCase() ===
        round.question.correctAnswer.toLowerCase()
    );

    if (!optionsIncludeCorrectAnswer) {
      options.push({
        id: null,
        value: round.question.correctAnswer,
        players: [],
      });
    }

    return shuffleArray(options);
    // Skipping this rule because we don't want to recalculate this value
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export default useOptions;
