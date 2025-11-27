import { useAuth } from "@/contexts/AuthContext";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import {
  Camera,
  LocationEdit as Edit3,
  Eye,
  EyeOff,
  LogOut,
  Mail,
  Save,
  User as UserIcon,
  X,
} from "lucide-react-native";
import { useState } from "react";
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function UserScreen() {
  const { user, signIn, signOut, updateProfile, updatePassword, loading: isLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  // const [isLoading, setIsLoading] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  // Form states
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [avatarUri, setAvatarUri] = useState(user?.avatarUrl || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSaveProfile = async () => {
    if (!fullName.trim()) {
      Alert.alert("Error", "Full name is required");
      return;
    }

    // setIsLoading(true);
    try {
      console.log("Updated");
      const { error } = await updateProfile({
        fullName: fullName.trim(),
        avatarUrl: avatarUri,
      });

      if (error) {
        Alert.alert("Error", "Failed to update profile. Please try again.");
      } else {
        Alert.alert("Success", "Profile updated successfully!");
        setIsEditing(false);
      }
    } catch (err) {
      console.error("Profile update error:", err);
      Alert.alert("Error", "An unexpected error occurred.");
    } finally {
      // setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setFullName(user?.fullName || "");
    setEmail(user?.email || "");
    setAvatarUri(user?.avatarUrl || "");
    setIsEditing(false);
    // setIsLoading(false);
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "New passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }

    const hasLetter = /[a-zA-Z]/.test(newPassword);
    const hasNumber = /[0-9]/.test(newPassword);
    if (!hasLetter || !hasNumber) {
      Alert.alert("Error", "Password must contain both letters and numbers");
      return;
    }

    try {
      // Xác thực current password trước
      const { error: signInError } = await signIn(email, currentPassword);
      if (signInError) {
        Alert.alert("Error", "Current password is incorrect");
        return;
      }

      // Nếu đúng, tiếp tục đổi mật khẩu
      const { error } = await updatePassword(newPassword);
      if (error) {
        Alert.alert("Error", error.message || "Failed to update password");
      } else {
        Alert.alert("Success", "Password updated successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "An error occurred");
    }
  };

  const handleLogout = async () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          try {
            const { error } = await signOut();
            if (error) {
              Alert.alert("Error", "Failed to sign out. Please try again.");
            } else {
              router.replace("/(auth)/login");
            }
          } catch (err) {
            console.error("Logout error:", err);
            Alert.alert("Error", "An error occurred while signing out.");
          }
        },
      },
    ]);
  };

  const pickImageFromLibrary = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Sorry, we need camera roll permissions to change your avatar."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setAvatarUri(result.assets[0].uri);
      setShowAvatarModal(false);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Sorry, we need camera permissions to take a photo."
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setAvatarUri(result.assets[0].uri);
      setShowAvatarModal(false);
    }
  };

  const removeAvatar = () => {
    setAvatarUri("");
    setShowAvatarModal(false);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={["#9B59B6", "#8E44AD"]}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>User Profile</Text>
            <Text style={styles.headerSubtitle}>
              Manage your account settings
            </Text>
          </View>
          <View style={styles.mascotContainer}>
            <Text style={styles.mascot}>👤</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.avatarSection}>
            <TouchableOpacity
              style={styles.avatarContainer}
              onPress={() => isEditing && setShowAvatarModal(true)}
              disabled={!isEditing}
            >
              {avatarUri ? (
                <Image source={{ uri: avatarUri }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <UserIcon size={40} color="#9B59B6" />
                </View>
              )}
              {isEditing && (
                <View style={styles.avatarEditOverlay}>
                  <Camera size={20} color="#FFFFFF" />
                </View>
              )}
            </TouchableOpacity>
            <Text style={styles.avatarLabel}>
              {isEditing ? "Tap to change avatar" : "Profile Picture"}
            </Text>
          </View>

          {/* Profile Form */}
          <View style={styles.formSection}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <View style={styles.inputContainer}>
                <UserIcon size={20} color="#7F8C8D" />
                <TextInput
                  style={[styles.input, !isEditing && styles.inputDisabled]}
                  value={fullName}
                  onChangeText={setFullName}
                  placeholder="Enter your full name"
                  placeholderTextColor="#BDC3C7"
                  editable={isEditing}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email</Text>
              <View style={styles.inputContainer}>
                <Mail size={20} color="#7F8C8D" />
                <TextInput
                  style={[styles.input, styles.inputDisabled]}
                  value={email}
                  placeholder="Email address"
                  placeholderTextColor="#BDC3C7"
                  editable={false}
                />
              </View>
              <Text style={styles.inputNote}>
                Email cannot be changed from this screen
              </Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionSection}>
            {!isEditing ? (
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => setIsEditing(true)}
              >
                <Edit3 size={20} color="#FFFFFF" />
                <Text style={styles.editButtonText}>Edit Profile</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.editActions}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={handleCancelEdit}
                  disabled={isLoading}
                >
                  <X size={20} color="#E74C3C" />
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.saveButton,
                    isLoading && styles.disabledButton,
                  ]}
                  onPress={handleSaveProfile}
                  disabled={isLoading}
                >
                  <Save size={20} color="#FFFFFF" />
                  <Text style={styles.saveButtonText}>
                    {isLoading ? "Saving..." : "Save"}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        {/* Change Password Pane */}
        <View style={styles.changePasswordSection}>
          <Text style={styles.sectionTitle}>Change Password</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Current Password</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                secureTextEntry={!showCurrentPassword}
                placeholder="Enter current password"
                placeholderTextColor="#BDC3C7"
                value={currentPassword}
                onChangeText={setCurrentPassword}
              />
              <TouchableOpacity onPress={() => setShowCurrentPassword(!showCurrentPassword)}>
                {showCurrentPassword ? <EyeOff size={20} color="#7F8C8D" /> : <Eye size={20} color="#7F8C8D" />}
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>New Password</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                secureTextEntry={!showNewPassword}
                placeholder="Enter new password"
                placeholderTextColor="#BDC3C7"
                value={newPassword}
                onChangeText={setNewPassword}
              />
              <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)}>
                {showNewPassword ? <EyeOff size={20} color="#7F8C8D" /> : <Eye size={20} color="#7F8C8D" />}
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Confirm New Password</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                secureTextEntry={!showConfirmPassword}
                placeholder="Re-enter new password"
                placeholderTextColor="#BDC3C7"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                {showConfirmPassword ? <EyeOff size={20} color="#7F8C8D" /> : <Eye size={20} color="#7F8C8D" />}
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleChangePassword}
          >
            <Text style={styles.saveButtonText}>Update Password</Text>
          </TouchableOpacity>
        </View>

        {/* Account Actions */}
        <View style={styles.accountSection}>
          <Text style={styles.sectionTitle}>Account Actions</Text>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LinearGradient
              colors={["#E74C3C", "#C0392B"]}
              style={styles.logoutGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <LogOut size={20} color="#FFFFFF" />
              <Text style={styles.logoutButtonText}>Sign Out</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* App Info */}
        <View style={styles.appInfoSection}>
          <Text style={styles.appInfoTitle}>EngLearn</Text>
          <Text style={styles.appInfoVersion}>Version 1.0.0</Text>
          <Text style={styles.appInfoDescription}>
            Learn English with Mochi & Michi! 🍡🐱
          </Text>
        </View>
      </ScrollView>

      {/* Avatar Selection Modal */}
      <Modal
        visible={showAvatarModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAvatarModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Change Avatar</Text>

            <TouchableOpacity style={styles.modalOption} onPress={takePhoto}>
              <Camera size={24} color="#3498DB" />
              <Text style={styles.modalOptionText}>Take Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalOption}
              onPress={pickImageFromLibrary}
            >
              <UserIcon size={24} color="#9B59B6" />
              <Text style={styles.modalOptionText}>Choose from Library</Text>
            </TouchableOpacity>

            {avatarUri && (
              <TouchableOpacity
                style={styles.modalOption}
                onPress={removeAvatar}
              >
                <X size={24} color="#E74C3C" />
                <Text style={styles.modalOptionText}>Remove Avatar</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.modalCancel}
              onPress={() => setShowAvatarModal(false)}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#FFFFFF",
    opacity: 0.9,
    marginTop: 4,
  },
  mascotContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 25,
    padding: 10,
  },
  mascot: {
    fontSize: 30,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  profileSection: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 25,
    marginTop: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  avatarSection: {
    alignItems: "center",
    marginBottom: 30,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 10,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#9B59B6",
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#F8F9FA",
    borderWidth: 3,
    borderColor: "#9B59B6",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarEditOverlay: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#9B59B6",
    borderRadius: 15,
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  avatarLabel: {
    fontSize: 14,
    color: "#7F8C8D",
    textAlign: "center",
  },
  formSection: {
    marginBottom: 25,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2C3E50",
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 2,
    borderColor: "#E8E6E8",
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#2C3E50",
    marginLeft: 10,
  },
  inputDisabled: {
    color: "#7F8C8D",
  },
  inputNote: {
    fontSize: 12,
    color: "#95A5A6",
    marginTop: 4,
    fontStyle: "italic",
  },
  actionSection: {
    alignItems: "center",
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#9B59B6",
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 24,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  editButtonText: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "600",
    marginLeft: 8,
  },
  editActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  cancelButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderWidth: 2,
    borderColor: "#E74C3C",
    flex: 1,
    marginRight: 10,
    justifyContent: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    color: "#E74C3C",
    fontWeight: "600",
    marginLeft: 8,
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2ECC71",
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 20,
    flex: 1,
    marginLeft: 10,
    justifyContent: "center",
  },
  saveButtonText: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "600",
    marginLeft: 8,
  },
  disabledButton: {
    opacity: 0.6,
  },
  accountSection: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 25,
    marginTop: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 20,
  },
  logoutButton: {
    borderRadius: 16,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  logoutGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  logoutButtonText: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "600",
    marginLeft: 8,
  },
  appInfoSection: {
    alignItems: "center",
    paddingVertical: 30,
    marginTop: 20,
  },
  appInfoTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#9B59B6",
    marginBottom: 4,
  },
  appInfoVersion: {
    fontSize: 14,
    color: "#7F8C8D",
    marginBottom: 8,
  },
  appInfoDescription: {
    fontSize: 16,
    color: "#2C3E50",
    textAlign: "center",
    lineHeight: 22,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 25,
    paddingBottom: 40,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2C3E50",
    textAlign: "center",
    marginBottom: 25,
  },
  modalOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    marginBottom: 12,
  },
  modalOptionText: {
    fontSize: 16,
    color: "#2C3E50",
    fontWeight: "500",
    marginLeft: 16,
  },
  modalCancel: {
    alignItems: "center",
    paddingVertical: 16,
    marginTop: 10,
  },
  modalCancelText: {
    fontSize: 16,
    color: "#7F8C8D",
    fontWeight: "500",
  },
  changePasswordSection: {
  backgroundColor: "#FFFFFF",
  borderRadius: 20,
  padding: 25,
  marginTop: 20,
  elevation: 3,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 8,
},
});