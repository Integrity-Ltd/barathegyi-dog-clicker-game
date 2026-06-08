import logoSrc from "../assets/logo.svg";
import type { CompletionResult } from "../game/types";
import { formatDate, formatNumber, formatTemplate } from "../i18n/format";
import type { LanguageCode, Messages } from "../i18n/translations";

interface CertificateParams {
  language: LanguageCode;
  messages: Messages;
  volunteerName: string;
  completion: CompletionResult;
}

interface WrappedLine {
  text: string;
  y: number;
}

const CERTIFICATE_WIDTH = 1000;
const CERTIFICATE_HEIGHT = 820;
const LOGO_ORANGE = "#FCC635";
const LOGO_ORANGE_DARK = "#9a5a00";
const LOGO_ORANGE_LIGHT = "#fff7e6";

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Could not load image: ${src}`));
    image.src = src;
  });
}

function drawCenteredImage(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  centerX: number,
  centerY: number,
  size: number,
) {
  context.drawImage(image, centerX - size / 2, centerY - size / 2, size, size);
}

function drawRoundedRect(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  const right = x + width;
  const bottom = y + height;

  context.beginPath();
  context.moveTo(x + radius, y);
  context.lineTo(right - radius, y);
  context.quadraticCurveTo(right, y, right, y + radius);
  context.lineTo(right, bottom - radius);
  context.quadraticCurveTo(right, bottom, right - radius, bottom);
  context.lineTo(x + radius, bottom);
  context.quadraticCurveTo(x, bottom, x, bottom - radius);
  context.lineTo(x, y + radius);
  context.quadraticCurveTo(x, y, x + radius, y);
  context.closePath();
}

function getTextSegments(text: string): string[] {
  if (/\s/.test(text)) {
    return text.split(/(\s+)/).filter(Boolean);
  }

  return Array.from(text);
}

function wrapText(
  context: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
): WrappedLine[] {
  const segments = getTextSegments(text);
  const lines: WrappedLine[] = [];
  let currentLine = "";
  let currentY = y;

  segments.forEach((segment) => {
    const nextLine = `${currentLine}${segment}`;

    if (currentLine && context.measureText(nextLine).width > maxWidth) {
      lines.push({ text: currentLine.trim(), y: currentY });
      currentLine = segment.trimStart();
      currentY += lineHeight;
      return;
    }

    currentLine = nextLine;
  });

  if (currentLine.trim()) {
    lines.push({ text: currentLine.trim(), y: currentY });
  }

  lines.forEach((line) => {
    context.fillText(line.text, x, line.y);
  });

  return lines;
}

function getDisplayName(messages: Messages, volunteerName: string): string {
  return volunteerName.trim() || messages.certificate.defaultVolunteerName;
}

function sanitizeFilename(value: string): string {
  const sanitized = value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}-]+/gu, "_")
    .replace(/^_+|_+$/g, "")
    .toLowerCase();

  return sanitized || "volunteer";
}

async function createCertificateCanvas({
  language,
  messages,
  volunteerName,
  completion,
}: CertificateParams): Promise<HTMLCanvasElement> {
  const canvas = document.createElement("canvas");
  canvas.width = CERTIFICATE_WIDTH;
  canvas.height = CERTIFICATE_HEIGHT;

  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Could not create certificate canvas context.");
  }

  const logoImage = await loadImage(logoSrc);
  const accentColor = LOGO_ORANGE;
  const title = completion.assisted
    ? messages.certificate.assistedTitle
    : messages.certificate.independentTitle;
  const displayName = getDisplayName(messages, volunteerName);
  const formattedClicks = formatNumber(language, completion.clicks);
  const formattedDate = formatDate(messages, completion.completedAt);

  context.direction = messages.meta.direction;
  context.fillStyle = "#fffdf5";
  context.fillRect(0, 0, CERTIFICATE_WIDTH, CERTIFICATE_HEIGHT);

  context.strokeStyle = accentColor;
  context.lineWidth = 14;
  context.strokeRect(24, 24, CERTIFICATE_WIDTH - 48, CERTIFICATE_HEIGHT - 48);

  context.strokeStyle = "#181818";
  context.lineWidth = 3;
  context.strokeRect(42, 42, CERTIFICATE_WIDTH - 84, CERTIFICATE_HEIGHT - 84);

  drawCenteredImage(context, logoImage, CERTIFICATE_WIDTH / 2, 145, 118);

  context.textAlign = "center";
  context.fillStyle = "#181818";
  context.font = '900 42px Arial, "Noto Sans", sans-serif';
  context.fillText(title.toLocaleUpperCase(messages.meta.locale), CERTIFICATE_WIDTH / 2, 258);

  context.font = '18px Arial, "Noto Sans", sans-serif';
  context.fillStyle = "#666";
  context.fillText(messages.certificate.exerciseName, CERTIFICATE_WIDTH / 2, 290);

  context.beginPath();
  context.moveTo(CERTIFICATE_WIDTH / 2 - 235, 308);
  context.lineTo(CERTIFICATE_WIDTH / 2 + 235, 308);
  context.strokeStyle = accentColor;
  context.lineWidth = 2;
  context.stroke();

  context.fillStyle = "#333";
  context.font = '21px Arial, "Noto Sans", sans-serif';
  context.fillText(messages.certificate.participantIntro, CERTIFICATE_WIDTH / 2, 360);

  context.fillStyle = LOGO_ORANGE_DARK;
  context.font = '900 38px Georgia, "Times New Roman", serif';
  context.fillText(displayName, CERTIFICATE_WIDTH / 2, 408);

  context.fillStyle = "#333";
  context.font = '21px Arial, "Noto Sans", sans-serif';

  if (completion.assisted) {
    context.fillText(messages.certificate.assistedSupportLine, CERTIFICATE_WIDTH / 2, 452);

    context.fillStyle = LOGO_ORANGE_DARK;
    context.font = '900 32px Arial, "Noto Sans", sans-serif';
    context.fillText(
      formatTemplate(messages.certificate.assistedClickLine, {
        clicks: formattedClicks,
      }),
      CERTIFICATE_WIDTH / 2,
      492,
    );

    context.fillStyle = "#333";
    context.font = '21px Arial, "Noto Sans", sans-serif';
    context.fillText(messages.certificate.assistedSuccessLine, CERTIFICATE_WIDTH / 2, 532);

    const boxX = CERTIFICATE_WIDTH / 2 - 345;
    const boxY = 562;
    const boxWidth = 690;
    const boxHeight = 110;
    context.fillStyle = LOGO_ORANGE_LIGHT;
    context.strokeStyle = accentColor;
    context.lineWidth = 2;
    drawRoundedRect(context, boxX, boxY, boxWidth, boxHeight, 14);
    context.fill();
    context.stroke();

    context.fillStyle = LOGO_ORANGE_DARK;
    context.font = 'italic 19px Arial, "Noto Sans", sans-serif';
    wrapText(
      context,
      messages.certificate.assistedChallengeBody,
      CERTIFICATE_WIDTH / 2,
      boxY + 36,
      boxWidth - 70,
      28,
    );
  } else {
    context.fillText(
      formatTemplate(messages.certificate.independentClickLine, {
        clicks: formattedClicks,
      }),
      CERTIFICATE_WIDTH / 2,
      472,
    );

    context.fillText(messages.certificate.independentSuccessLine, CERTIFICATE_WIDTH / 2, 514);

    const boxX = CERTIFICATE_WIDTH / 2 - 310;
    const boxY = 548;
    const boxWidth = 620;
    const boxHeight = 82;
    context.fillStyle = LOGO_ORANGE_LIGHT;
    context.strokeStyle = accentColor;
    context.lineWidth = 2;
    drawRoundedRect(context, boxX, boxY, boxWidth, boxHeight, 14);
    context.fill();
    context.stroke();

    context.fillStyle = "#92600a";
    context.font = '900 24px Arial, "Noto Sans", sans-serif';
    context.fillText(messages.certificate.independentBadge, CERTIFICATE_WIDTH / 2, boxY + 50);
  }

  context.fillStyle = "#888";
  context.font = '17px Arial, "Noto Sans", sans-serif';
  context.fillText(
    formatTemplate(messages.certificate.issuedAt, {
      date: formattedDate,
    }),
    CERTIFICATE_WIDTH / 2,
    704,
  );

  context.strokeStyle = "#181818";
  context.lineWidth = 1.5;
  context.beginPath();
  context.moveTo(CERTIFICATE_WIDTH / 2 - 170, 720);
  context.lineTo(CERTIFICATE_WIDTH / 2 + 170, 720);
  context.stroke();

  context.fillStyle = "#666";
  context.font = '16px Arial, "Noto Sans", sans-serif';
  context.fillText(messages.certificate.organizationLine, CERTIFICATE_WIDTH / 2, 755);

  return canvas;
}

export async function downloadCertificate(params: CertificateParams) {
  const canvas = await createCertificateCanvas(params);
  const url = canvas.toDataURL("image/png");
  const anchor = document.createElement("a");
  const documentSlug = params.completion.assisted
    ? "participation-certificate"
    : "training-certificate";
  const nameSlug = sanitizeFilename(
    getDisplayName(params.messages, params.volunteerName),
  );

  anchor.href = url;
  anchor.download = `${documentSlug}-${nameSlug}.png`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
}
