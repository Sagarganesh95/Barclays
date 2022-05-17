export  interface HOSTTEMPLATE {
    id:number,
    sitename: string,
    buildingname: string,
    floorname: string,
    hostname: string,
    firstresponse: string,
    lastresponse: string,
    desk: number,
    nova: number,
    hostlogtodaycount: number,
    hostlogtimespecifed: number,
    subject: string,
    status: STATUS [],
    resReview?: string,
    timezone?: string,
    comments?: string
};

export interface STATUS {
    status30m: boolean,
    status1D: boolean,
    status1W: boolean,
};