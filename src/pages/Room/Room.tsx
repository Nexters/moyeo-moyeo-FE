import { Admin } from './Admin';
import { Entry } from './Entry';
import { NotFound } from './NotFound';
import { Player } from './Player';

const Room = () => {
  const role: string | null = 'admin';
  const exist = true;

  if (!exist) return <NotFound />;
  if (!role) return <Entry />;
  return role === 'player' ? <Player /> : <Admin />;
};

export default Room;
