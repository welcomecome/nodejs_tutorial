import {Service, Inject} from 'typedi';
import memberModel from '../models/member';

@Service()
export default class memberService {
    constructor(
        @Inject('memberModel') private memberModel: Models.memberModel,
        @Inject('logger') private logger,
    ) {}

    public async Insert(member) {
        const memberRecord = await this.memberModel.create(member);

        return {member: memberRecord};
    };
};