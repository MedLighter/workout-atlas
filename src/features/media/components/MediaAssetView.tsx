import { useEffect, useState } from 'react';
import { Image, View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import type { MediaAsset } from '../../workout/model/workout.types';
import { selectBestMediaAsset } from '../utils/mediaPriority';
import { SvgFallback } from './SvgFallback';

interface MediaAssetViewProps {
  assets?: MediaAsset[];
  role?: MediaAsset['role'];
  height?: number;
  className?: string;
}

export function MediaAssetView({ assets, role, height = 140, className }: MediaAssetViewProps) {
  const asset = selectBestMediaAsset(assets, role);
  const [svgContent, setSvgContent] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setFailed(false);
    setSvgContent(null);

    if (!asset) {
      return;
    }

    if (asset.format === 'svg') {
      fetch(asset.url)
        .then((response) => {
          if (!response.ok) throw new Error('SVG fetch failed');
          return response.text();
        })
        .then((text) => {
          if (!cancelled) setSvgContent(text);
        })
        .catch(() => {
          if (!cancelled) setFailed(true);
        });
    }

    return () => {
      cancelled = true;
    };
  }, [asset?.url, asset?.format]);

  if (!asset || failed) {
    return <SvgFallback label={asset?.alt ?? 'Нет изображения'} height={height} />;
  }

  if (asset.format === 'svg') {
    if (!svgContent) {
      return (
        <View
          className={`bg-zinc-900 border border-zinc-800 rounded-xl items-center justify-center ${className ?? ''}`}
          style={{ height }}
        />
      );
    }
    return (
      <View
        className={`bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden items-center justify-center ${className ?? ''}`}
        style={{ height }}
      >
        <SvgXml xml={svgContent} width="100%" height={height} />
      </View>
    );
  }

  return (
    <View
      className={`bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden ${className ?? ''}`}
      style={{ height }}
    >
      <Image
        source={{ uri: asset.url }}
        accessibilityLabel={asset.alt}
        style={{ width: '100%', height }}
        resizeMode="cover"
        onError={() => setFailed(true)}
      />
    </View>
  );
}