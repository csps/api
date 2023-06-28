import Database from "../database";
import { ErrorTypes } from "../../types";

class Event{
    private id: number;
    private title: String;
    private description: String;
    private thumbnail: String;
    private date: Date;
    private startTime: Date;
    private endTime: Date;
    private location: String;
    private constructor(
        id: number,
        title: string,
        description: string,
        thumbnail: string,
        date: Date,
        startTime: Date,
        endTime: Date,
        location: string,
    ){
        this.id = id;
        this.title = title;
        this.description = description;
        this.thumbnail = thumbnail;
        this.date = date;
        this.startTime = startTime;
        this.endTime = endTime;
        this.location = location;
    }

    public static fromId(id: number, callback: (error: ErrorTypes | null, event: Event | null) => void){
        const db = Database.getInstance();

        db.query("SELECT * from events where id = ?", [id], (error,results) => {
            if(error){
                console.log(error);
                callback(ErrorTypes.DB_ERROR,null);
                return
            }
            
            if(results.length === 0){
                callback(ErrorTypes.DB_EMPTY_RESULT,null)
                return
            }

            const data = results[0]

            const event = new Event(
                data.id,
                data.title,
                data.description,
                data.thumbnail,
                data.date,
                data.startTime,
                data.endTime,
                data.location
            ) 

            callback(null,event)
        })

    }

    public static getEvents(callback: (error: ErrorTypes | null, events: Event[] | null) => void){
        const db = Database.getInstance();

        db.query("SELECT * FROM events",[],(err,result) => {
            if(err){
                callback(ErrorTypes.DB_ERROR,null)
                return
            }

            if(result.length === 0){
                callback(ErrorTypes.DB_EMPTY_RESULT,null)
                return
            }

            const allEvents: Event[] = []
            
            result.forEach((data: any) => {
                const event = new Event(
                    data.id,
                    data.title,
                    data.description,
                    data.thumbnail,
                    data.date,
                    data.startTime,
                    data.endTime,
                    data.location
                )
                allEvents.push(event)
            });

            callback(null,allEvents)
        })
    }
}

export default Event