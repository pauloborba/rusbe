import SuggestionSchema from '../models/suggestion';
import Suggestion from '../../../common/suggestion';

export class SuggestionsRepository {

    async createSuggestion(newSuggestion: Suggestion) {
        if (!newSuggestion.id || !newSuggestion.content || !newSuggestion.author || !newSuggestion.timestamp) {
            throw new Error('IncompleteRequest');
        }

        return (
            await SuggestionSchema.create({
                id: newSuggestion.id,
                content: newSuggestion.content,
                author: newSuggestion.author,
                timestamp: newSuggestion.timestamp
            })
        );
    }

    async getUserSuggestions(userId: string): Promise<Suggestion[]> {
        const queryResult = await SuggestionSchema.find({author: userId});

        const suggestions: Suggestion[] = [];
        for (const element of queryResult) {
            const suggestion: Suggestion = {
                id: element.id,
                content: (element as any)?.content,
                author: (element as any)?.author,
                timestamp: (element as any)?.timestamp
            }
            suggestions.push(suggestion);
        }

        return suggestions;
    }
}