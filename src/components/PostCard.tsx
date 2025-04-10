// ... (Existing code) ...

    export const PostCard: React.FC<PostCardProps> = ({ post }) => {
      const author = post.animal_id ? post.animal : post.user; // Use animal if available, otherwise user

      return (
        <View style={styles.container}>
          <Image source={{ uri: post.image_url }} style={styles.image} />
          <View style={styles.content}>
            <View style={styles.header}>
              <TouchableOpacity onPress={() => author.id ? navigateToAnimal(author.id) : navigateToUser(author.id)}>
                <View style={styles.userAvatar}>
                  <Image source={{ uri: author.avatar_url }} style={styles.avatar} />
                </View>
                <Text style={styles.username}>{author.username || author.name}</Text>
              </TouchableOpacity>
              <Text style={styles.timestamp}>{post.created_at}</Text>
            </View>
            <Text style={styles.caption}>{post.caption}</Text>
            <Text style={styles.type}>{post.type}</Text>
          </View>
        </View>
      );
    };

    // ... (Existing styles) ...
