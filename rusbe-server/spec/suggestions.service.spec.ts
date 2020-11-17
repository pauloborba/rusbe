import { SuggestionsRepository } from '../src/repositories/suggestions.repository';
import Suggestion from '../../common/suggestion';
import { v4 as generateId } from 'uuid';
import SuggestionSchema from '../src/models/suggestion';

describe("The suggestions repository", () => {
    let repository: SuggestionsRepository;
    const testSuggestion = {
        id: generateId(),
        content: 'Test content',
        author: 'suggestiontestauthor',
        timestamp: new Date()
    };

    beforeEach(() => {
        repository = new SuggestionsRepository();
    });

    afterAll(async () => {
        await SuggestionSchema.deleteMany({author: testSuggestion.author})
    });

    it("stores suggestions correctly", async () => {
        await repository.createSuggestion(testSuggestion as unknown as Suggestion)
        const result = await repository.getUserSuggestions(testSuggestion.author);
        const addedSuggestion = result.find(suggestion => suggestion.id === testSuggestion.id);

        expect(addedSuggestion.author).toBe(testSuggestion.author as any);
        expect(addedSuggestion.content).toBe(testSuggestion.content)
        expect(addedSuggestion.id).toBe(testSuggestion.id)
        expect(addedSuggestion.timestamp.getTime()).toBe(addedSuggestion.timestamp.getTime())
    });
});