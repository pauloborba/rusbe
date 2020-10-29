import Router from 'express'
import { QueueRepository } from "../repositories/queue.repository";

const queueService = Router();
const queueRepository = new QueueRepository();
const queueBasePath = '/queue';

queueService.get(queueBasePath + '/voteRight',async(req,res)=>{
    try {
        const canVote = await queueRepository.canVote(req.body.userId);
        res.send(canVote);
    } catch (error) {
        res.status(404).send({message: error.message});
    }
})

export default queueService
