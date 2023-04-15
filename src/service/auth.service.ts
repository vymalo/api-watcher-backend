import session from 'express-session';
import passport from 'passport';
import { Express } from 'express';
import { BaseService } from './base.service';
import { Strategy as AppCustomStrategy } from 'passport-custom';

export class AuthService implements BaseService {
    private static readonly fakeUser = {
        id: 'userId',
    };
    private static readonly basicFakeError = {};

    public async init(app: Express) {
        app.use(
            session({
                secret: process.env.SESSION_SECRET!,
            })
        );

        passport.serializeUser(async (user, done) => {
            const u = await this.serializeUser(user);
            if (!u) return done(AuthService.basicFakeError);
            done(null, u.id);
        });

        passport.deserializeUser(async (id: string, done) => {
            const uid = await this.deserializeUser(id);
            if (!uid) return done(AuthService.basicFakeError);
            done(null, { id: uid });
        });

        passport.use(
            'api_auth',
            new AppCustomStrategy(this.handleCustomStrategy)
        );

        app.use(passport.initialize({}));
    }

    private readonly handleCustomStrategy = async (req, done) => {
        const r = await this.authenticate();
        done(null, r);
    };

    private async authenticate() {
        return AuthService.fakeUser;
    }

    private async serializeUser(user: Express.User) {
        return user as any;
    }

    private async deserializeUser(id: string) {
        return id;
    }
}
