/** Gerador de payload PIX ("copia e cola") no padrão EMV/BR Code do Bacen.
 * Totalmente offline: nenhuma chamada de API externa envolvida. */

interface PixPayloadInput {
  chave: string;
  nomeRecebedor: string;
  cidade: string;
  valor?: number;
  identificador?: string;
  descricao?: string;
}

function tlv(id: string, value: string): string {
  const length = value.length.toString().padStart(2, "0");
  return `${id}${length}${value}`;
}

function normalizeText(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .toUpperCase();
}

function crc16(payload: string): string {
  let crc = 0xffff;
  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      crc = (crc & 0x8000) !== 0 ? ((crc << 1) ^ 0x1021) & 0xffff : (crc << 1) & 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}

export function buildPixPayload({
  chave,
  nomeRecebedor,
  cidade,
  valor,
  identificador = "***",
  descricao,
}: PixPayloadInput): string {
  const nome = normalizeText(nomeRecebedor).slice(0, 25) || "RECEBEDOR";
  const localCidade = normalizeText(cidade).slice(0, 15) || "BRASIL";

  const merchantAccountInfo =
    tlv("00", "br.gov.bcb.pix") +
    tlv("01", chave.trim()) +
    (descricao ? tlv("02", descricao.slice(0, 40)) : "");

  const additionalDataField = tlv("05", identificador.slice(0, 25));

  const fields =
    tlv("00", "01") +
    tlv("01", "11") +
    tlv("26", merchantAccountInfo) +
    tlv("52", "0000") +
    tlv("53", "986") +
    (valor && valor > 0 ? tlv("54", valor.toFixed(2)) : "") +
    tlv("58", "BR") +
    tlv("59", nome) +
    tlv("60", localCidade) +
    tlv("62", additionalDataField);

  const payloadSemCrc = `${fields}6304`;
  return payloadSemCrc + crc16(payloadSemCrc);
}
