import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  Linking,
  Dimensions,
} from 'react-native';
import {
  Copy,
  Facebook,
  Instagram,
  Mail,
  Share2,
  X as XIcon,
  Link2,
  MessageCircle,
} from 'lucide-react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface ShareSheetProps {
  visible: boolean;
  onClose: () => void;
  url: string;
  title: string;
}

const SHARE_OPTIONS = [
  {
    id: 'instagram',
    name: 'Instagram',
    icon: Instagram,
    color: '#E4405F',
    url: (url: string) => `instagram://share?url=${encodeURIComponent(url)}`,
    webUrl: (url: string) => `https://instagram.com`,
  },
  {
    id: 'facebook',
    name: 'Facebook',
    icon: Facebook,
    color: '#1877F2',
    url: (url: string) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  {
    id: 'threads',
    name: 'Threads',
    icon: MessageCircle,
    color: '#000000',
    url: (url: string) => `https://threads.net`,
  },
  {
    id: 'twitter',
    name: 'X (Twitter)',
    icon: XIcon,
    color: '#000000',
    url: (url: string, title: string) => 
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
  },
  {
    id: 'bluesky',
    name: 'Bluesky',
    icon: Share2,
    color: '#0560FF',
    url: (url: string) => `https://bsky.app`,
  },
  {
    id: 'pinterest',
    name: 'Pinterest',
    icon: Link2,
    color: '#E60023',
    url: (url: string, title: string) => 
      `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&description=${encodeURIComponent(title)}`,
  },
  {
    id: 'telegram',
    name: 'Telegram',
    icon: Share2,
    color: '#0088cc',
    url: (url: string, title: string) => 
      `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    icon: MessageCircle,
    color: '#25D366',
    url: (url: string, title: string) => 
      `whatsapp://send?text=${encodeURIComponent(`${title} ${url}`)}`,
    webUrl: (url: string, title: string) => 
      `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
  },
  {
    id: 'viber',
    name: 'Viber',
    icon: MessageCircle,
    color: '#7360F2',
    url: (url: string) => `viber://forward?text=${encodeURIComponent(url)}`,
    webUrl: (url: string) => `viber://chat?text=${encodeURIComponent(url)}`,
  },
  {
    id: 'email',
    name: 'Email',
    icon: Mail,
    color: '#666666',
    url: (url: string, title: string) => 
      `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`,
  },
];

export default function ShareSheet({ visible, onClose, url, title }: ShareSheetProps) {
  const handleShare = async (option: typeof SHARE_OPTIONS[0]) => {
    try {
      const shareUrl = option.url(url, title);
      const webUrl = option.webUrl?.(url, title) || shareUrl;

      if (Platform.OS === 'web') {
        window.open(webUrl, '_blank', 'noopener,noreferrer');
      } else {
        const supported = await Linking.canOpenURL(shareUrl);
        if (supported) {
          await Linking.openURL(shareUrl);
        } else if (option.webUrl) {
          await Linking.openURL(webUrl);
        }
      }
      onClose();
    } catch (error) {
      console.error('Share failed:', error);
    }
  };

  const handleCopyLink = async () => {
    try {
      if (Platform.OS === 'web') {
        await navigator.clipboard.writeText(url);
      }
      alert('Link copied to clipboard!');
      onClose();
    } catch (error) {
      console.error('Copy failed:', error);
    }
  };

  if (!visible) return null;

  return (
    <View style={styles.container}>
      <View style={styles.sheet}>
        <View style={styles.header}>
          <Text style={styles.title}>Share to</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <XIcon size={24} color="#333333" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.optionsContainer}>
          <View style={styles.optionsGrid}>
            {SHARE_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={styles.optionItem}
                onPress={() => handleShare(option)}>
                <View style={[styles.iconCircle, { backgroundColor: option.color }]}>
                  <option.icon size={24} color="#FFFFFF" />
                </View>
                <Text style={styles.optionText}>{option.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <TouchableOpacity
          style={styles.copyButton}
          onPress={handleCopyLink}>
          <Copy size={20} color="#666666" style={styles.copyIcon} />
          <Text style={styles.copyText}>Copy link</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sheet: {
    height: SCREEN_HEIGHT * 0.4, // 40% of screen height
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  closeButton: {
    position: 'absolute',
    right: 16,
    padding: 8,
  },
  optionsContainer: {
    flex: 1,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    justifyContent: 'space-between',
  },
  optionItem: {
    width: '20%',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  optionText: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#EFEFEF',
  },
  copyIcon: {
    marginRight: 8,
  },
  copyText: {
    fontSize: 16,
    color: '#666666',
  },
});

export default ShareSheet
