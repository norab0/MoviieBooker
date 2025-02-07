import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "../../users/entities/user.entity";

@Entity()
export class Reservation {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    movieId: number;

    @Column()
    timeStart: Date;

    @Column()
    timeEnd: Date;

    @ManyToOne(() => User, (user) => user.reservations)
    user: User;
}