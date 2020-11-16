import Router from 'express'
import { SuggestionsRepository } from '../repositories/suggestions.repository';

const suggestionsService = Router()
const suggestionsRepository = new SuggestionsRepository();
const suggestionsBasePath = '/suggestions';

suggestionsService.get(suggestionsBasePath, async (req, res) => {
    try {
       const suggestions = await suggestionsRepository.getUserSuggestions(req.query.userId as string);
       res.send({suggestions});
    } catch (error) {
        res.status(500).send({message: error.message});
    }
})

suggestionsService.post(suggestionsBasePath + '/new', async (req, res) => {
    try {
        await suggestionsRepository.createSuggestion(req.body);
        res.send({result: 'success'});
    } catch (error) {
        res.status(500).send({message: error.message});
    }
})

export default suggestionsService;
