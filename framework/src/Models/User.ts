import { IUser } from "../interfaces/IUser";


export class User implements IUser {
    name: string = SourceCode.Forms.SessionManagement.Session.userdisplayname;
    email: string = SourceCode.Forms.SessionManagement.Session.useremail;
    fqn: string = SourceCode.Forms.SessionManagement.Session.userfqn;

}
