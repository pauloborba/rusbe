import Router from 'express'
import { QueueRepository } from "../repositories/queue.repository";
import QueueVote from "../../../common/queueVote";
import User from "../../../common/user";

const queueService = Router();
const queueRepository = new QueueRepository();
const queueBasePath = '/queue';

queueService.get(queueBasePath, async(req,res)=>{
    try {
        const queueStatus = queueRepository.getQueueStatus();
        res.send(queueStatus);
    } catch (error) {
        res.status(500).send({message: error.message});
    }
})

queueService.post(queueBasePath + '/voteRight',async(req,res)=>{
    try {
        const canVote = await queueRepository.canVote(req.body.id, req.body.password);
        res.send(canVote);
    } catch (error) {
        res.status(500).send({message: error.message});
    }
})

queueService.post(queueBasePath + '/vote',async(req,res)=>{
    try {
        const vote = req.body.vote as QueueVote;
        const user = req.body.user as User;
        const voted = await queueRepository.doVote(vote, user);
        res.send(voted);
    } catch (error) {
        res.status(500).send({message: error.message});
    }
})

export default queueService
