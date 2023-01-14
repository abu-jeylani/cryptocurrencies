import { Crypto } from "../types";

type Props = {
  crypto: Crypto;
};

const PriceDisplay: React.FC<Props> = ({ crypto }) => {
  return (
    <div>
      <p>{crypto.name + "$" + crypto.current_price}</p>
    </div>
  );
};

export default PriceDisplay;
