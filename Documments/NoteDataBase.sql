
-- drop table [DMTrangThaiDonHang]

CREATE TABLE [dbo].[DMTrangThaiDonHang](
	[Ma] int NOT NULL,
	[Ten] [dbo].[DT_LONG_DESCRIPTION] NULL,
	[HanhDong] [dbo].[DT_LONG_DESCRIPTION] NULL,
	TenNgan DT_SHORT_STRING  null,
	Icon DT_SHORT_STRING  null,
 CONSTRAINT [PK_DMTrangThaiDonHang] PRIMARY KEY CLUSTERED 
(
	[Ma] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

delete DMTrangThaiDonHang

insert DMTrangThaiDonHang values (0, N'Chờ xử lý', '', N'Chờ xử lý', 'fa-file-text-o'),
(1, N'Đã tiếp nhận', N'Tiếp nhận đơn hàng', N'Tiếp nhận', 'fa-archive'),
(2, N'Đang giao hàng', N'Gửi giao hàng', N'Đang giao', 'fa-truck'),
(3, N'Giao hàng thành công', N'Giao hàng thành công', N'Đã giao', 'fa-check-square-o'),
(99, N'Đã huỷ', '', N'Đã huỷ','fa-trash-o')

update DMDonHang set TrangThai = 99 where Active = 0

alter table DMDonHang add NgayTrangThai datetime null
update DMDonHang set NgayTrangThai = NgayTao
alter table DMDonHang alter column NgayTrangThai datetime not null
