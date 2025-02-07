import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Reservation} from "../../reservation/entities/reservation.entity";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    password: string;

    @OneToMany(() => Reservation, (reservations) => reservations.user)
    reservations: Reservation[];
}