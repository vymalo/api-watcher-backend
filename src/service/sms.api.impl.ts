import { SmsRequestModel } from '../model/sms-request.model';
import {
    AddSmsRequestResponse,
    DeleteSmsRequestResponse,
    GetAnSmsRequestResponse,
    GetSmsRequestsResponse,
    SmsApi,
} from '../gen/api/api/sms/types';
import { Api } from '../gen/api/models';
import { SocketService } from './socket.service';

export class SmsApiImpl implements SmsApi {
    constructor(private readonly socketService: SocketService) {}

    public async addSmsRequest(request: {
        [name: string]: Api.SmsRequestValue;
    }): Promise<AddSmsRequestResponse> {
        const insertedGraph = await SmsRequestModel.transaction(async (trx) => {
            const saved = await SmsRequestModel.query(trx).insertGraph({
                request_body: JSON.stringify(request),
            });
            return saved;
        });

        this.socketService.send('new_sms_request', this.map(insertedGraph));

        return {
            body: this.map(insertedGraph),
            status: 200,
        };
    }

    public async deleteSmsRequest(
        smsRequestId: string
    ): Promise<DeleteSmsRequestResponse> {
        const q = SmsRequestModel.query().findById(smsRequestId).delete();

        const r = await q;

        return {
            status: r === 1 ? 200 : 404,
        };
    }

    public async getAnSmsRequest(
        smsRequestId: string
    ): Promise<GetAnSmsRequestResponse> {
        const q = SmsRequestModel.query().findById(smsRequestId);

        const r = await q;

        if (!r)
            return {
                status: 404,
            };

        return {
            body: this.map(r),
            status: 200,
        };
    }

    public async getSmsRequests(
        query: string | undefined,
        createdAt: string | undefined,
        page = 0,
        size = 4
    ): Promise<GetSmsRequestsResponse> {
        const q = SmsRequestModel.query();

        if (query) {
            q.modify('searchByQuery', query);
        }
        if (createdAt) {
            q.where('created_at', '>=', createdAt);
        }

        q.orderBy('created_at', 'DESC');

        const data = await q.page(page, size);

        return {
            body: {
                content: data.results.map(this.map),
                meta: { total: data.total, size, page },
            },
            status: 200,
        };
    }

    private map({ id, created_at, request_body }: SmsRequestModel) {
        return {
            id,
            created_at,
            ...JSON.parse(request_body),
        };
    }
}
