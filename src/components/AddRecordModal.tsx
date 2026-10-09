import { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import Modal from './Modal';
import type { BusinessRecord } from '../data/teamData';
import { useAppData } from '../data/dataContext';

interface AddRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (newRecord: BusinessRecord) => void;
}

const cities = ['Toshkent', 'Samarqand', 'Buxoro', 'Qarshi', 'Andijon', 'Fargʻona', 'Jizzax'];

const AddRecordModal = ({ isOpen, onClose, onAdd }: AddRecordModalProps) => {
  const { members } = useAppData();
  const [name, setName] = useState('');
  const [member, setMember] = useState(members[0]?.name || 'Abdulloh');
  const [category, setCategory] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Toshkent');
  const [address, setAddress] = useState('');
  const [link, setLink] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const record: BusinessRecord = {
      id: `custom-${Date.now()}`,
      member,
      name: name.trim(),
      category: category.trim() || 'Xizmatlar',
      phone: phone.trim(),
      city,
      address: address.trim(),
      link: link.trim(),
      status: 'verified',
      raw: {},
    };

    onAdd(record);
    setName('');
    setCategory('');
    setPhone('');
    setAddress('');
    setLink('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <span className="inline-flex items-center gap-2">
          <PlusCircle size={20} className="text-brand-600" />
          Yangi biznes qoʻshish
        </span>
      }
      subtitle="Maʼlumotlarni toʻldiring — yozuv avtomatik «Yangi» statusida saqlanadi"
      maxWidth="sm"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink-soft" htmlFor="biznes-nomi">
            Biznes nomi *
          </label>
          <input
            id="biznes-nomi"
            required
            className="input"
            placeholder="Masalan: Rayhon Milliy Taomlar"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-soft" htmlFor="azo">
              Kirituvchi aʼzo
            </label>
            <select
              id="azo"
              className="input"
              value={member}
              onChange={(e) => setMember(e.target.value)}
            >
              {members.map((m) => (
                <option key={m.id} value={m.name}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-soft" htmlFor="shahar">
              Shahar
            </label>
            <select
              id="shahar"
              className="input"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            >
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink-soft" htmlFor="kategoriya">
            Kategoriya / faoliyat turi
          </label>
          <input
            id="kategoriya"
            className="input"
            placeholder="Masalan: Restoran, Taʼlim, Mebel..."
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink-soft" htmlFor="telefon">
            Telefon raqami
          </label>
          <input
            id="telefon"
            className="input"
            placeholder="+998 90 123 45 67"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink-soft" htmlFor="manzil">
            Manzil
          </label>
          <input
            id="manzil"
            className="input"
            placeholder="Koʻcha, uy yoki moʻljal"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink-soft" htmlFor="havola">
            Veb-sayt yoki havola (ixtiyoriy)
          </label>
          <input
            id="havola"
            className="input"
            placeholder="https://example.uz"
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />
        </div>

        <div className="mt-1 flex justify-end gap-2.5 border-t border-line pt-4">
          <button type="button" onClick={onClose} className="btn-ghost">
            Bekor qilish
          </button>
          <button type="submit" className="btn-primary">
            Saqlash
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddRecordModal;
