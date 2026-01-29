import 'dart:async';

import 'package:flutter/foundation.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:intl/intl.dart' as intl;

import 'app_localizations_en.dart';
import 'app_localizations_vi.dart';
import 'app_localizations_zh.dart';

// ignore_for_file: type=lint

/// Callers can lookup localized strings with an instance of AppLocalizations
/// returned by `AppLocalizations.of(context)`.
///
/// Applications need to include `AppLocalizations.delegate()` in their app's
/// `localizationDelegates` list, and the locales they support in the app's
/// `supportedLocales` list. For example:
///
/// ```dart
/// import 'l10n/app_localizations.dart';
///
/// return MaterialApp(
///   localizationsDelegates: AppLocalizations.localizationsDelegates,
///   supportedLocales: AppLocalizations.supportedLocales,
///   home: MyApplicationHome(),
/// );
/// ```
///
/// ## Update pubspec.yaml
///
/// Please make sure to update your pubspec.yaml to include the following
/// packages:
///
/// ```yaml
/// dependencies:
///   # Internationalization support.
///   flutter_localizations:
///     sdk: flutter
///   intl: any # Use the pinned version from flutter_localizations
///
///   # Rest of dependencies
/// ```
///
/// ## iOS Applications
///
/// iOS applications define key application metadata, including supported
/// locales, in an Info.plist file that is built into the application bundle.
/// To configure the locales supported by your app, you’ll need to edit this
/// file.
///
/// First, open your project’s ios/Runner.xcworkspace Xcode workspace file.
/// Then, in the Project Navigator, open the Info.plist file under the Runner
/// project’s Runner folder.
///
/// Next, select the Information Property List item, select Add Item from the
/// Editor menu, then select Localizations from the pop-up menu.
///
/// Select and expand the newly-created Localizations item then, for each
/// locale your application supports, add a new item and select the locale
/// you wish to add from the pop-up menu in the Value field. This list should
/// be consistent with the languages listed in the AppLocalizations.supportedLocales
/// property.
abstract class AppLocalizations {
  AppLocalizations(String locale)
    : localeName = intl.Intl.canonicalizedLocale(locale.toString());

  final String localeName;

  static AppLocalizations? of(BuildContext context) {
    return Localizations.of<AppLocalizations>(context, AppLocalizations);
  }

  static const LocalizationsDelegate<AppLocalizations> delegate =
      _AppLocalizationsDelegate();

  /// A list of this localizations delegate along with the default localizations
  /// delegates.
  ///
  /// Returns a list of localizations delegates containing this delegate along with
  /// GlobalMaterialLocalizations.delegate, GlobalCupertinoLocalizations.delegate,
  /// and GlobalWidgetsLocalizations.delegate.
  ///
  /// Additional delegates can be added by appending to this list in
  /// MaterialApp. This list does not have to be used at all if a custom list
  /// of delegates is preferred or required.
  static const List<LocalizationsDelegate<dynamic>> localizationsDelegates =
      <LocalizationsDelegate<dynamic>>[
        delegate,
        GlobalMaterialLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
      ];

  /// A list of this localizations delegate's supported locales.
  static const List<Locale> supportedLocales = <Locale>[
    Locale('en'),
    Locale('vi'),
    Locale('zh'),
  ];

  /// Tên ứng dụng
  ///
  /// In vi, this message translates to:
  /// **'Dự Án Xây Dựng'**
  String get appName;

  /// No description provided for @welcome.
  ///
  /// In vi, this message translates to:
  /// **'Chào mừng'**
  String get welcome;

  /// No description provided for @hello.
  ///
  /// In vi, this message translates to:
  /// **'Xin chào'**
  String get hello;

  /// No description provided for @goodbye.
  ///
  /// In vi, this message translates to:
  /// **'Tạm biệt'**
  String get goodbye;

  /// No description provided for @yes.
  ///
  /// In vi, this message translates to:
  /// **'Có'**
  String get yes;

  /// No description provided for @no.
  ///
  /// In vi, this message translates to:
  /// **'Không'**
  String get no;

  /// No description provided for @ok.
  ///
  /// In vi, this message translates to:
  /// **'OK'**
  String get ok;

  /// No description provided for @cancel.
  ///
  /// In vi, this message translates to:
  /// **'Hủy'**
  String get cancel;

  /// No description provided for @save.
  ///
  /// In vi, this message translates to:
  /// **'Lưu'**
  String get save;

  /// No description provided for @delete.
  ///
  /// In vi, this message translates to:
  /// **'Xóa'**
  String get delete;

  /// No description provided for @edit.
  ///
  /// In vi, this message translates to:
  /// **'Sửa'**
  String get edit;

  /// No description provided for @add.
  ///
  /// In vi, this message translates to:
  /// **'Thêm'**
  String get add;

  /// No description provided for @search.
  ///
  /// In vi, this message translates to:
  /// **'Tìm kiếm'**
  String get search;

  /// No description provided for @filter.
  ///
  /// In vi, this message translates to:
  /// **'Lọc'**
  String get filter;

  /// No description provided for @sort.
  ///
  /// In vi, this message translates to:
  /// **'Sắp xếp'**
  String get sort;

  /// No description provided for @refresh.
  ///
  /// In vi, this message translates to:
  /// **'Làm mới'**
  String get refresh;

  /// No description provided for @loading.
  ///
  /// In vi, this message translates to:
  /// **'Đang tải...'**
  String get loading;

  /// No description provided for @error.
  ///
  /// In vi, this message translates to:
  /// **'Lỗi'**
  String get error;

  /// No description provided for @success.
  ///
  /// In vi, this message translates to:
  /// **'Thành công'**
  String get success;

  /// No description provided for @warning.
  ///
  /// In vi, this message translates to:
  /// **'Cảnh báo'**
  String get warning;

  /// No description provided for @info.
  ///
  /// In vi, this message translates to:
  /// **'Thông tin'**
  String get info;

  /// No description provided for @confirm.
  ///
  /// In vi, this message translates to:
  /// **'Xác nhận'**
  String get confirm;

  /// No description provided for @close.
  ///
  /// In vi, this message translates to:
  /// **'Đóng'**
  String get close;

  /// No description provided for @back.
  ///
  /// In vi, this message translates to:
  /// **'Quay lại'**
  String get back;

  /// No description provided for @next.
  ///
  /// In vi, this message translates to:
  /// **'Tiếp theo'**
  String get next;

  /// No description provided for @previous.
  ///
  /// In vi, this message translates to:
  /// **'Trước'**
  String get previous;

  /// No description provided for @finish.
  ///
  /// In vi, this message translates to:
  /// **'Hoàn thành'**
  String get finish;

  /// No description provided for @submit.
  ///
  /// In vi, this message translates to:
  /// **'Gửi'**
  String get submit;

  /// No description provided for @done.
  ///
  /// In vi, this message translates to:
  /// **'Xong'**
  String get done;

  /// No description provided for @settings.
  ///
  /// In vi, this message translates to:
  /// **'Cài đặt'**
  String get settings;

  /// No description provided for @profile.
  ///
  /// In vi, this message translates to:
  /// **'Hồ sơ'**
  String get profile;

  /// No description provided for @logout.
  ///
  /// In vi, this message translates to:
  /// **'Đăng xuất'**
  String get logout;

  /// No description provided for @login.
  ///
  /// In vi, this message translates to:
  /// **'Đăng nhập'**
  String get login;

  /// No description provided for @register.
  ///
  /// In vi, this message translates to:
  /// **'Đăng ký'**
  String get register;

  /// No description provided for @forgotPassword.
  ///
  /// In vi, this message translates to:
  /// **'Quên mật khẩu?'**
  String get forgotPassword;

  /// No description provided for @resetPassword.
  ///
  /// In vi, this message translates to:
  /// **'Đặt lại mật khẩu'**
  String get resetPassword;

  /// No description provided for @changePassword.
  ///
  /// In vi, this message translates to:
  /// **'Đổi mật khẩu'**
  String get changePassword;

  /// No description provided for @password.
  ///
  /// In vi, this message translates to:
  /// **'Mật khẩu'**
  String get password;

  /// No description provided for @confirmPassword.
  ///
  /// In vi, this message translates to:
  /// **'Xác nhận mật khẩu'**
  String get confirmPassword;

  /// No description provided for @email.
  ///
  /// In vi, this message translates to:
  /// **'Email'**
  String get email;

  /// No description provided for @username.
  ///
  /// In vi, this message translates to:
  /// **'Tên đăng nhập'**
  String get username;

  /// No description provided for @phoneNumber.
  ///
  /// In vi, this message translates to:
  /// **'Số điện thoại'**
  String get phoneNumber;

  /// No description provided for @fullName.
  ///
  /// In vi, this message translates to:
  /// **'Họ và tên'**
  String get fullName;

  /// No description provided for @firstName.
  ///
  /// In vi, this message translates to:
  /// **'Tên'**
  String get firstName;

  /// No description provided for @lastName.
  ///
  /// In vi, this message translates to:
  /// **'Họ'**
  String get lastName;

  /// No description provided for @address.
  ///
  /// In vi, this message translates to:
  /// **'Địa chỉ'**
  String get address;

  /// No description provided for @city.
  ///
  /// In vi, this message translates to:
  /// **'Thành phố'**
  String get city;

  /// No description provided for @country.
  ///
  /// In vi, this message translates to:
  /// **'Quốc gia'**
  String get country;

  /// No description provided for @language.
  ///
  /// In vi, this message translates to:
  /// **'Ngôn ngữ'**
  String get language;

  /// No description provided for @theme.
  ///
  /// In vi, this message translates to:
  /// **'Giao diện'**
  String get theme;

  /// No description provided for @darkMode.
  ///
  /// In vi, this message translates to:
  /// **'Chế độ tối'**
  String get darkMode;

  /// No description provided for @lightMode.
  ///
  /// In vi, this message translates to:
  /// **'Chế độ sáng'**
  String get lightMode;

  /// No description provided for @systemMode.
  ///
  /// In vi, this message translates to:
  /// **'Theo hệ thống'**
  String get systemMode;

  /// No description provided for @notifications.
  ///
  /// In vi, this message translates to:
  /// **'Thông báo'**
  String get notifications;

  /// No description provided for @privacy.
  ///
  /// In vi, this message translates to:
  /// **'Quyền riêng tư'**
  String get privacy;

  /// No description provided for @terms.
  ///
  /// In vi, this message translates to:
  /// **'Điều khoản'**
  String get terms;

  /// No description provided for @about.
  ///
  /// In vi, this message translates to:
  /// **'Giới thiệu'**
  String get about;

  /// No description provided for @version.
  ///
  /// In vi, this message translates to:
  /// **'Phiên bản'**
  String get version;

  /// No description provided for @update.
  ///
  /// In vi, this message translates to:
  /// **'Cập nhật'**
  String get update;

  /// No description provided for @share.
  ///
  /// In vi, this message translates to:
  /// **'Chia sẻ'**
  String get share;

  /// No description provided for @invite.
  ///
  /// In vi, this message translates to:
  /// **'Mời'**
  String get invite;

  /// No description provided for @help.
  ///
  /// In vi, this message translates to:
  /// **'Trợ giúp'**
  String get help;

  /// No description provided for @feedback.
  ///
  /// In vi, this message translates to:
  /// **'Phản hồi'**
  String get feedback;

  /// No description provided for @reportBug.
  ///
  /// In vi, this message translates to:
  /// **'Báo lỗi'**
  String get reportBug;

  /// No description provided for @rateApp.
  ///
  /// In vi, this message translates to:
  /// **'Đánh giá ứng dụng'**
  String get rateApp;

  /// No description provided for @home.
  ///
  /// In vi, this message translates to:
  /// **'Trang chủ'**
  String get home;

  /// No description provided for @dashboard.
  ///
  /// In vi, this message translates to:
  /// **'Bảng điều khiển'**
  String get dashboard;

  /// No description provided for @projects.
  ///
  /// In vi, this message translates to:
  /// **'Dự án'**
  String get projects;

  /// No description provided for @tasks.
  ///
  /// In vi, this message translates to:
  /// **'Công việc'**
  String get tasks;

  /// No description provided for @calendar.
  ///
  /// In vi, this message translates to:
  /// **'Lịch'**
  String get calendar;

  /// No description provided for @documents.
  ///
  /// In vi, this message translates to:
  /// **'Tài liệu'**
  String get documents;

  /// No description provided for @reports.
  ///
  /// In vi, this message translates to:
  /// **'Báo cáo'**
  String get reports;

  /// No description provided for @analytics.
  ///
  /// In vi, this message translates to:
  /// **'Phân tích'**
  String get analytics;

  /// No description provided for @team.
  ///
  /// In vi, this message translates to:
  /// **'Nhóm'**
  String get team;

  /// No description provided for @members.
  ///
  /// In vi, this message translates to:
  /// **'Thành viên'**
  String get members;

  /// No description provided for @clients.
  ///
  /// In vi, this message translates to:
  /// **'Khách hàng'**
  String get clients;

  /// No description provided for @suppliers.
  ///
  /// In vi, this message translates to:
  /// **'Nhà cung cấp'**
  String get suppliers;

  /// No description provided for @inventory.
  ///
  /// In vi, this message translates to:
  /// **'Kho'**
  String get inventory;

  /// No description provided for @materials.
  ///
  /// In vi, this message translates to:
  /// **'Vật liệu'**
  String get materials;

  /// No description provided for @equipment.
  ///
  /// In vi, this message translates to:
  /// **'Thiết bị'**
  String get equipment;

  /// No description provided for @budget.
  ///
  /// In vi, this message translates to:
  /// **'Ngân sách'**
  String get budget;

  /// No description provided for @expenses.
  ///
  /// In vi, this message translates to:
  /// **'Chi phí'**
  String get expenses;

  /// No description provided for @income.
  ///
  /// In vi, this message translates to:
  /// **'Thu nhập'**
  String get income;

  /// No description provided for @invoices.
  ///
  /// In vi, this message translates to:
  /// **'Hóa đơn'**
  String get invoices;

  /// No description provided for @payments.
  ///
  /// In vi, this message translates to:
  /// **'Thanh toán'**
  String get payments;

  /// No description provided for @construction.
  ///
  /// In vi, this message translates to:
  /// **'Xây dựng'**
  String get construction;

  /// No description provided for @project.
  ///
  /// In vi, this message translates to:
  /// **'Dự án'**
  String get project;

  /// No description provided for @building.
  ///
  /// In vi, this message translates to:
  /// **'Tòa nhà'**
  String get building;

  /// No description provided for @floor.
  ///
  /// In vi, this message translates to:
  /// **'Tầng'**
  String get floor;

  /// No description provided for @room.
  ///
  /// In vi, this message translates to:
  /// **'Phòng'**
  String get room;

  /// No description provided for @area.
  ///
  /// In vi, this message translates to:
  /// **'Diện tích'**
  String get area;

  /// No description provided for @startDate.
  ///
  /// In vi, this message translates to:
  /// **'Ngày bắt đầu'**
  String get startDate;

  /// No description provided for @endDate.
  ///
  /// In vi, this message translates to:
  /// **'Ngày kết thúc'**
  String get endDate;

  /// No description provided for @deadline.
  ///
  /// In vi, this message translates to:
  /// **'Hạn chót'**
  String get deadline;

  /// No description provided for @status.
  ///
  /// In vi, this message translates to:
  /// **'Trạng thái'**
  String get status;

  /// No description provided for @progress.
  ///
  /// In vi, this message translates to:
  /// **'Tiến độ'**
  String get progress;

  /// No description provided for @completed.
  ///
  /// In vi, this message translates to:
  /// **'Hoàn thành'**
  String get completed;

  /// No description provided for @inProgress.
  ///
  /// In vi, this message translates to:
  /// **'Đang thực hiện'**
  String get inProgress;

  /// No description provided for @pending.
  ///
  /// In vi, this message translates to:
  /// **'Chờ xử lý'**
  String get pending;

  /// No description provided for @cancelled.
  ///
  /// In vi, this message translates to:
  /// **'Đã hủy'**
  String get cancelled;

  /// No description provided for @onHold.
  ///
  /// In vi, this message translates to:
  /// **'Tạm dừng'**
  String get onHold;

  /// No description provided for @manager.
  ///
  /// In vi, this message translates to:
  /// **'Quản lý'**
  String get manager;

  /// No description provided for @supervisor.
  ///
  /// In vi, this message translates to:
  /// **'Giám sát'**
  String get supervisor;

  /// No description provided for @worker.
  ///
  /// In vi, this message translates to:
  /// **'Công nhân'**
  String get worker;

  /// No description provided for @contractor.
  ///
  /// In vi, this message translates to:
  /// **'Nhà thầu'**
  String get contractor;

  /// No description provided for @architect.
  ///
  /// In vi, this message translates to:
  /// **'Kiến trúc sư'**
  String get architect;

  /// No description provided for @engineer.
  ///
  /// In vi, this message translates to:
  /// **'Kỹ sư'**
  String get engineer;

  /// No description provided for @noData.
  ///
  /// In vi, this message translates to:
  /// **'Không có dữ liệu'**
  String get noData;

  /// No description provided for @noResults.
  ///
  /// In vi, this message translates to:
  /// **'Không có kết quả'**
  String get noResults;

  /// No description provided for @tryAgain.
  ///
  /// In vi, this message translates to:
  /// **'Thử lại'**
  String get tryAgain;

  /// No description provided for @pullToRefresh.
  ///
  /// In vi, this message translates to:
  /// **'Kéo để làm mới'**
  String get pullToRefresh;

  /// No description provided for @releaseToRefresh.
  ///
  /// In vi, this message translates to:
  /// **'Thả để làm mới'**
  String get releaseToRefresh;

  /// No description provided for @refreshing.
  ///
  /// In vi, this message translates to:
  /// **'Đang làm mới...'**
  String get refreshing;

  /// No description provided for @connectionError.
  ///
  /// In vi, this message translates to:
  /// **'Lỗi kết nối'**
  String get connectionError;

  /// No description provided for @serverError.
  ///
  /// In vi, this message translates to:
  /// **'Lỗi máy chủ'**
  String get serverError;

  /// No description provided for @unknownError.
  ///
  /// In vi, this message translates to:
  /// **'Lỗi không xác định'**
  String get unknownError;

  /// No description provided for @timeout.
  ///
  /// In vi, this message translates to:
  /// **'Hết thời gian'**
  String get timeout;

  /// No description provided for @noInternet.
  ///
  /// In vi, this message translates to:
  /// **'Không có kết nối Internet'**
  String get noInternet;

  /// No description provided for @today.
  ///
  /// In vi, this message translates to:
  /// **'Hôm nay'**
  String get today;

  /// No description provided for @yesterday.
  ///
  /// In vi, this message translates to:
  /// **'Hôm qua'**
  String get yesterday;

  /// No description provided for @tomorrow.
  ///
  /// In vi, this message translates to:
  /// **'Ngày mai'**
  String get tomorrow;

  /// No description provided for @week.
  ///
  /// In vi, this message translates to:
  /// **'Tuần'**
  String get week;

  /// No description provided for @month.
  ///
  /// In vi, this message translates to:
  /// **'Tháng'**
  String get month;

  /// No description provided for @year.
  ///
  /// In vi, this message translates to:
  /// **'Năm'**
  String get year;

  /// No description provided for @all.
  ///
  /// In vi, this message translates to:
  /// **'Tất cả'**
  String get all;

  /// No description provided for @none.
  ///
  /// In vi, this message translates to:
  /// **'Không có'**
  String get none;

  /// No description provided for @select.
  ///
  /// In vi, this message translates to:
  /// **'Chọn'**
  String get select;

  /// No description provided for @selectAll.
  ///
  /// In vi, this message translates to:
  /// **'Chọn tất cả'**
  String get selectAll;

  /// No description provided for @deselectAll.
  ///
  /// In vi, this message translates to:
  /// **'Bỏ chọn tất cả'**
  String get deselectAll;

  /// No description provided for @confirmDelete.
  ///
  /// In vi, this message translates to:
  /// **'Bạn có chắc chắn muốn xóa?'**
  String get confirmDelete;

  /// No description provided for @confirmLogout.
  ///
  /// In vi, this message translates to:
  /// **'Bạn có chắc chắn muốn đăng xuất?'**
  String get confirmLogout;

  /// No description provided for @confirmCancel.
  ///
  /// In vi, this message translates to:
  /// **'Bạn có chắc chắn muốn hủy?'**
  String get confirmCancel;

  /// No description provided for @unsavedChanges.
  ///
  /// In vi, this message translates to:
  /// **'Bạn có thay đổi chưa lưu. Bạn có muốn tiếp tục?'**
  String get unsavedChanges;

  /// No description provided for @required.
  ///
  /// In vi, this message translates to:
  /// **'Bắt buộc'**
  String get required;

  /// No description provided for @optional.
  ///
  /// In vi, this message translates to:
  /// **'Tùy chọn'**
  String get optional;

  /// No description provided for @invalidEmail.
  ///
  /// In vi, this message translates to:
  /// **'Email không hợp lệ'**
  String get invalidEmail;

  /// No description provided for @invalidPhone.
  ///
  /// In vi, this message translates to:
  /// **'Số điện thoại không hợp lệ'**
  String get invalidPhone;

  /// No description provided for @passwordTooShort.
  ///
  /// In vi, this message translates to:
  /// **'Mật khẩu quá ngắn'**
  String get passwordTooShort;

  /// No description provided for @passwordMismatch.
  ///
  /// In vi, this message translates to:
  /// **'Mật khẩu không khớp'**
  String get passwordMismatch;

  /// No description provided for @fieldRequired.
  ///
  /// In vi, this message translates to:
  /// **'Trường này là bắt buộc'**
  String get fieldRequired;

  /// No description provided for @male.
  ///
  /// In vi, this message translates to:
  /// **'Nam'**
  String get male;

  /// No description provided for @female.
  ///
  /// In vi, this message translates to:
  /// **'Nữ'**
  String get female;

  /// No description provided for @other.
  ///
  /// In vi, this message translates to:
  /// **'Khác'**
  String get other;

  /// No description provided for @uploadFile.
  ///
  /// In vi, this message translates to:
  /// **'Tải file lên'**
  String get uploadFile;

  /// No description provided for @downloadFile.
  ///
  /// In vi, this message translates to:
  /// **'Tải file xuống'**
  String get downloadFile;

  /// No description provided for @viewFile.
  ///
  /// In vi, this message translates to:
  /// **'Xem file'**
  String get viewFile;

  /// No description provided for @fileSize.
  ///
  /// In vi, this message translates to:
  /// **'Kích thước file'**
  String get fileSize;

  /// No description provided for @fileType.
  ///
  /// In vi, this message translates to:
  /// **'Loại file'**
  String get fileType;

  /// No description provided for @camera.
  ///
  /// In vi, this message translates to:
  /// **'Máy ảnh'**
  String get camera;

  /// No description provided for @gallery.
  ///
  /// In vi, this message translates to:
  /// **'Thư viện'**
  String get gallery;

  /// No description provided for @takePhoto.
  ///
  /// In vi, this message translates to:
  /// **'Chụp ảnh'**
  String get takePhoto;

  /// No description provided for @choosePhoto.
  ///
  /// In vi, this message translates to:
  /// **'Chọn ảnh'**
  String get choosePhoto;

  /// No description provided for @map.
  ///
  /// In vi, this message translates to:
  /// **'Bản đồ'**
  String get map;

  /// No description provided for @location.
  ///
  /// In vi, this message translates to:
  /// **'Vị trí'**
  String get location;

  /// No description provided for @direction.
  ///
  /// In vi, this message translates to:
  /// **'Chỉ đường'**
  String get direction;

  /// No description provided for @distance.
  ///
  /// In vi, this message translates to:
  /// **'Khoảng cách'**
  String get distance;

  /// No description provided for @notification.
  ///
  /// In vi, this message translates to:
  /// **'Thông báo'**
  String get notification;

  /// No description provided for @message.
  ///
  /// In vi, this message translates to:
  /// **'Tin nhắn'**
  String get message;

  /// No description provided for @chat.
  ///
  /// In vi, this message translates to:
  /// **'Trò chuyện'**
  String get chat;

  /// No description provided for @call.
  ///
  /// In vi, this message translates to:
  /// **'Gọi'**
  String get call;

  /// No description provided for @videoCall.
  ///
  /// In vi, this message translates to:
  /// **'Gọi video'**
  String get videoCall;

  /// No description provided for @sortBy.
  ///
  /// In vi, this message translates to:
  /// **'Sắp xếp theo'**
  String get sortBy;

  /// No description provided for @filterBy.
  ///
  /// In vi, this message translates to:
  /// **'Lọc theo'**
  String get filterBy;

  /// No description provided for @groupBy.
  ///
  /// In vi, this message translates to:
  /// **'Nhóm theo'**
  String get groupBy;

  /// No description provided for @ascending.
  ///
  /// In vi, this message translates to:
  /// **'Tăng dần'**
  String get ascending;

  /// No description provided for @descending.
  ///
  /// In vi, this message translates to:
  /// **'Giảm dần'**
  String get descending;

  /// No description provided for @alphabetical.
  ///
  /// In vi, this message translates to:
  /// **'Bảng chữ cái'**
  String get alphabetical;

  /// No description provided for @newest.
  ///
  /// In vi, this message translates to:
  /// **'Mới nhất'**
  String get newest;

  /// No description provided for @oldest.
  ///
  /// In vi, this message translates to:
  /// **'Cũ nhất'**
  String get oldest;

  /// No description provided for @export.
  ///
  /// In vi, this message translates to:
  /// **'Xuất'**
  String get export;

  /// No description provided for @import.
  ///
  /// In vi, this message translates to:
  /// **'Nhập'**
  String get import;

  /// No description provided for @print.
  ///
  /// In vi, this message translates to:
  /// **'In'**
  String get print;

  /// No description provided for @copy.
  ///
  /// In vi, this message translates to:
  /// **'Sao chép'**
  String get copy;

  /// No description provided for @paste.
  ///
  /// In vi, this message translates to:
  /// **'Dán'**
  String get paste;

  /// No description provided for @cut.
  ///
  /// In vi, this message translates to:
  /// **'Cắt'**
  String get cut;

  /// No description provided for @monday.
  ///
  /// In vi, this message translates to:
  /// **'Thứ Hai'**
  String get monday;

  /// No description provided for @tuesday.
  ///
  /// In vi, this message translates to:
  /// **'Thứ Ba'**
  String get tuesday;

  /// No description provided for @wednesday.
  ///
  /// In vi, this message translates to:
  /// **'Thứ Tư'**
  String get wednesday;

  /// No description provided for @thursday.
  ///
  /// In vi, this message translates to:
  /// **'Thứ Năm'**
  String get thursday;

  /// No description provided for @friday.
  ///
  /// In vi, this message translates to:
  /// **'Thứ Sáu'**
  String get friday;

  /// No description provided for @saturday.
  ///
  /// In vi, this message translates to:
  /// **'Thứ Bảy'**
  String get saturday;

  /// No description provided for @sunday.
  ///
  /// In vi, this message translates to:
  /// **'Chủ Nhật'**
  String get sunday;

  /// No description provided for @january.
  ///
  /// In vi, this message translates to:
  /// **'Tháng Một'**
  String get january;

  /// No description provided for @february.
  ///
  /// In vi, this message translates to:
  /// **'Tháng Hai'**
  String get february;

  /// No description provided for @march.
  ///
  /// In vi, this message translates to:
  /// **'Tháng Ba'**
  String get march;

  /// No description provided for @april.
  ///
  /// In vi, this message translates to:
  /// **'Tháng Tư'**
  String get april;

  /// No description provided for @may.
  ///
  /// In vi, this message translates to:
  /// **'Tháng Năm'**
  String get may;

  /// No description provided for @june.
  ///
  /// In vi, this message translates to:
  /// **'Tháng Sáu'**
  String get june;

  /// No description provided for @july.
  ///
  /// In vi, this message translates to:
  /// **'Tháng Bảy'**
  String get july;

  /// No description provided for @august.
  ///
  /// In vi, this message translates to:
  /// **'Tháng Tám'**
  String get august;

  /// No description provided for @september.
  ///
  /// In vi, this message translates to:
  /// **'Tháng Chín'**
  String get september;

  /// No description provided for @october.
  ///
  /// In vi, this message translates to:
  /// **'Tháng Mười'**
  String get october;

  /// No description provided for @november.
  ///
  /// In vi, this message translates to:
  /// **'Tháng Mười Một'**
  String get november;

  /// No description provided for @december.
  ///
  /// In vi, this message translates to:
  /// **'Tháng Mười Hai'**
  String get december;
}

class _AppLocalizationsDelegate
    extends LocalizationsDelegate<AppLocalizations> {
  const _AppLocalizationsDelegate();

  @override
  Future<AppLocalizations> load(Locale locale) {
    return SynchronousFuture<AppLocalizations>(lookupAppLocalizations(locale));
  }

  @override
  bool isSupported(Locale locale) =>
      <String>['en', 'vi', 'zh'].contains(locale.languageCode);

  @override
  bool shouldReload(_AppLocalizationsDelegate old) => false;
}

AppLocalizations lookupAppLocalizations(Locale locale) {
  // Lookup logic when only language code is specified.
  switch (locale.languageCode) {
    case 'en':
      return AppLocalizationsEn();
    case 'vi':
      return AppLocalizationsVi();
    case 'zh':
      return AppLocalizationsZh();
  }

  throw FlutterError(
    'AppLocalizations.delegate failed to load unsupported locale "$locale". This is likely '
    'an issue with the localizations generation tool. Please file an issue '
    'on GitHub with a reproducible sample app and the gen-l10n configuration '
    'that was used.',
  );
}
