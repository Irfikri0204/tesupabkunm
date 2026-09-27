import ButtonPrimary from './ButtonPrimary';
type CardTestProps = {
    title: string;
    description: string;
    link: string;
};

export default function CardTes({ title, description, link }: CardTestProps) {
    return (
        <div className="flex h-full flex-col justify-between rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl transition duration-300 hover:-translate-y-1 hover:border-[#A67CBA] hover:shadow-2xl">
            <div className="space-y-4 text-left">
                <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
                <p className="text-slate-600">{description}</p>
            </div>
            <ButtonPrimary text="Mulai Tes" link={link} isLebar={true} />
        </div>
    );
}
