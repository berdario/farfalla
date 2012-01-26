<div class="counts form">
<?php echo $this->Form->create('Count');?>
	<fieldset>
		<legend><?php __('Edit Count'); ?></legend>
	<?php
		echo $this->Form->input('id');
		echo $this->Form->input('url');
		echo $this->Form->input('lw');
		echo $this->Form->input('nw');
		echo $this->Form->input('ns');
		echo $this->Form->input('readability');
	?>
	</fieldset>
<?php echo $this->Form->end(__('Submit', true));?>
</div>
<div class="actions">
	<h3><?php __('Actions'); ?></h3>
	<ul>

		<li><?php echo $this->Html->link(__('Delete', true), array('action' => 'delete', $this->Form->value('Count.id')), null, sprintf(__('Are you sure you want to delete # %s?', true), $this->Form->value('Count.id'))); ?></li>
		<li><?php echo $this->Html->link(__('List Counts', true), array('action' => 'index'));?></li>
	</ul>
</div>