import ButtonPrimary from './ButtonPrimary';
type CardTestProps = {
    title: string;
    description: string;
    link: string;
};

export default function CardTes({ title, description, link }: CardTestProps) {
    return (
        <div className="card-tes flex flex-col items-center justify-between gap-y-4 rounded-lg bg-white p-6 text-center shadow-lg hover:scale-105 hover:bg-gray-200 hover:shadow-xl">
            <div className="konten flex-col items-start gap-y-4 text-left text-black">
                <h3 className="font-semibold">{title}</h3>
                <p>{description}</p>
            </div>
            <ButtonPrimary text="Mulai Tes" link={link} isLebar={true} />
        </div>
    );
}
